import { v } from "convex/values";

import { internal } from "./_generated/api";
import { httpAction, internalMutation, query } from "./_generated/server";
import { isAdmin } from "./admin";
import { authComponent } from "./auth";
import { usageKind } from "./schema";

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

/** Weeks of history on /admin/stats. */
const STATS_WEEKS = 8;
/** Days the top lists cover. */
const TOP_DAYS = 30;
/** Rows one stats read may take from the daily table. */
const MAX_ITEM_ROWS = 8000;
/** Registry files that are indexes, not components. */
const NOT_COMPONENTS = new Set(["registry", "index"]);

/** Raw events, daily rows, and visitor rows older than these are deleted. */
const KEEP_EVENTS_DAYS = 30;
const KEEP_DAILY_DAYS = 90;
const KEEP_VISITOR_WEEKS = 2;
const PRUNE_BATCH = 500;

function dayKey(at: number) {
  return new Date(at).toISOString().slice(0, 10);
}

/** The Monday, in UTC, that starts the week holding `at`. */
function weekKey(at: number) {
  const day = Math.floor(at / DAY_MS) * DAY_MS;
  const sinceMonday = (new Date(day).getUTCDay() + 6) % 7;
  return dayKey(day - sinceMonday * DAY_MS);
}

/** Adds one request to the log and to the daily and weekly counts. */
export const record = internalMutation({
  args: {
    at: v.number(),
    kind: usageKind,
    item: v.string(),
    tool: v.optional(v.string()),
    ipHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("usageEvents", args);

    // Point lookups only, so concurrent requests rarely conflict.
    const day = dayKey(args.at);
    const week = weekKey(args.at);
    const key = args.kind === "mcp" ? (args.tool ?? "unknown") : args.item;

    const daily = await ctx.db
      .query("usageItems")
      .withIndex("by_kind_day_item", (q) =>
        q.eq("kind", args.kind).eq("day", day).eq("item", key),
      )
      .unique();
    if (daily) {
      await ctx.db.patch(daily._id, { count: daily.count + 1 });
    } else {
      await ctx.db.insert("usageItems", {
        day,
        kind: args.kind,
        item: key,
        count: 1,
      });
    }

    const seen = await ctx.db
      .query("usageVisitors")
      .withIndex("by_kind_week_hash", (q) =>
        q.eq("kind", args.kind).eq("week", week).eq("ipHash", args.ipHash),
      )
      .unique();
    if (!seen) {
      await ctx.db.insert("usageVisitors", {
        week,
        kind: args.kind,
        ipHash: args.ipHash,
      });
    }

    const weekly = await ctx.db
      .query("usageWeeks")
      .withIndex("by_kind_week", (q) =>
        q.eq("kind", args.kind).eq("week", week),
      )
      .unique();
    if (weekly) {
      await ctx.db.patch(weekly._id, {
        requests: weekly.requests + 1,
        visitors: weekly.visitors + (seen ? 0 : 1),
      });
    } else {
      await ctx.db.insert("usageWeeks", {
        week,
        kind: args.kind,
        requests: 1,
        visitors: seen ? 0 : 1,
      });
    }
  },
});

/** Compares two strings in time that does not depend on where they differ. */
function sameSecret(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    // biome-ignore lint/suspicious/noBitwiseOperators: constant-time compare
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function shortString(value: unknown, max: number) {
  return typeof value === "string" && value.length <= max ? value : null;
}

/**
 * POST /usage/log on the deployment's .convex.site URL. Only the site can
 * write: it sends USAGE_LOG_SECRET in the x-usage-secret header.
 */
export const log = httpAction(async (ctx, request) => {
  const secret = process.env.USAGE_LOG_SECRET;
  const sent = request.headers.get("x-usage-secret") ?? "";
  if (!(secret && sameSecret(sent, secret))) {
    return new Response(null, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!isRecord(body)) {
    return new Response(null, { status: 400 });
  }

  const kind =
    body.kind === "registry" || body.kind === "mcp" ? body.kind : null;
  const item = shortString(body.item ?? "", 200);
  const tool =
    body.tool === undefined ? undefined : shortString(body.tool, 100);
  const ipHash = shortString(body.ipHash, 128);
  if (!(kind && item !== null && tool !== null && ipHash)) {
    return new Response(null, { status: 400 });
  }

  await ctx.runMutation(internal.usage.record, {
    at: Date.now(),
    kind,
    item,
    tool,
    ipHash,
  });
  return new Response(null, { status: 204 });
});

function topEntries(rows: { item: string; count: number }[], limit: number) {
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.item, (totals.get(row.item) ?? 0) + row.count);
  }
  return [...totals]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

/** Everything /admin/stats shows, or null for anyone but an admin. */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await authComponent.safeGetAuthUser(ctx);
    if (!(viewer && isAdmin(viewer.email))) {
      return null;
    }

    const now = Date.now();
    const thisWeek = Date.parse(weekKey(now));
    const weeks = Array.from({ length: STATS_WEEKS }, (_, index) =>
      dayKey(thisWeek - (STATS_WEEKS - 1 - index) * WEEK_MS),
    );
    const firstWeek = weeks[0] ?? weekKey(now);

    const [registryWeeks, mcpWeeks] = await Promise.all(
      (["registry", "mcp"] as const).map((kind) =>
        ctx.db
          .query("usageWeeks")
          .withIndex("by_kind_week", (q) =>
            q.eq("kind", kind).gte("week", firstWeek),
          )
          .take(STATS_WEEKS + 1),
      ),
    );

    const weekly = weeks.map((week) => {
      const registry = registryWeeks?.find((row) => row.week === week);
      const mcp = mcpWeeks?.find((row) => row.week === week);
      return {
        week,
        installs: registry?.requests ?? 0,
        installers: registry?.visitors ?? 0,
        mcpCalls: mcp?.requests ?? 0,
        mcpClients: mcp?.visitors ?? 0,
      };
    });

    const since = dayKey(now - (TOP_DAYS - 1) * DAY_MS);
    const [registryDays, mcpDays] = await Promise.all(
      (["registry", "mcp"] as const).map((kind) =>
        ctx.db
          .query("usageItems")
          .withIndex("by_kind_day_item", (q) =>
            q.eq("kind", kind).gte("day", since),
          )
          .take(MAX_ITEM_ROWS),
      ),
    );

    return {
      generatedAt: now,
      topDays: TOP_DAYS,
      weekly,
      topComponents: topEntries(
        (registryDays ?? []).filter((row) => !NOT_COMPONENTS.has(row.item)),
        10,
      ),
      topTools: topEntries(mcpDays ?? [], 10),
      truncated:
        (registryDays?.length ?? 0) === MAX_ITEM_ROWS ||
        (mcpDays?.length ?? 0) === MAX_ITEM_ROWS,
    };
  },
});

/** Deletes old rows in batches; runs daily from crons.ts and reschedules itself. */
export const prune = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const events = await ctx.db
      .query("usageEvents")
      .withIndex("by_at", (q) => q.lt("at", now - KEEP_EVENTS_DAYS * DAY_MS))
      .take(PRUNE_BATCH);

    const oldDay = dayKey(now - KEEP_DAILY_DAYS * DAY_MS);
    const oldWeek = weekKey(now - KEEP_VISITOR_WEEKS * WEEK_MS);
    const [registryDays, mcpDays, registryVisitors, mcpVisitors] =
      await Promise.all([
        ctx.db
          .query("usageItems")
          .withIndex("by_kind_day_item", (q) =>
            q.eq("kind", "registry").lt("day", oldDay),
          )
          .take(PRUNE_BATCH),
        ctx.db
          .query("usageItems")
          .withIndex("by_kind_day_item", (q) =>
            q.eq("kind", "mcp").lt("day", oldDay),
          )
          .take(PRUNE_BATCH),
        ctx.db
          .query("usageVisitors")
          .withIndex("by_kind_week_hash", (q) =>
            q.eq("kind", "registry").lt("week", oldWeek),
          )
          .take(PRUNE_BATCH),
        ctx.db
          .query("usageVisitors")
          .withIndex("by_kind_week_hash", (q) =>
            q.eq("kind", "mcp").lt("week", oldWeek),
          )
          .take(PRUNE_BATCH),
      ]);

    const batches = [
      events,
      registryDays,
      mcpDays,
      registryVisitors,
      mcpVisitors,
    ];
    for (const batch of batches) {
      for (const row of batch) {
        await ctx.db.delete(row._id);
      }
    }
    if (batches.some((batch) => batch.length === PRUNE_BATCH)) {
      await ctx.scheduler.runAfter(0, internal.usage.prune, {});
    }
  },
});
