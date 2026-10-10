import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/** Where a logged request came from: the registry's JSON files, or the MCP server. */
export const usageKind = v.union(v.literal("registry"), v.literal("mcp"));

/*
 * The usage log behind /admin/stats. Sign-in data lives in the Better Auth
 * component's own tables, not here.
 */
export default defineSchema({
  /** One row per request, kept for 30 days (see crons.ts). Stats never scan it. */
  usageEvents: defineTable({
    at: v.number(),
    kind: usageKind,
    /** The registry item or component, or "" when the call names none. */
    item: v.string(),
    /** The MCP tool or method, for MCP calls. */
    tool: v.optional(v.string()),
    /** HMAC of the client IP; the IP itself is never stored. */
    ipHash: v.string(),
  }).index("by_at", ["at"]),

  /** Requests per day: per registry item, or per MCP tool. */
  usageItems: defineTable({
    day: v.string(),
    kind: usageKind,
    item: v.string(),
    count: v.number(),
  }).index("by_kind_day_item", ["kind", "day", "item"]),

  /** Requests and unique clients per week (weeks start on Monday, UTC). */
  usageWeeks: defineTable({
    week: v.string(),
    kind: usageKind,
    requests: v.number(),
    visitors: v.number(),
  }).index("by_kind_week", ["kind", "week"]),

  /** Which hashed clients were already counted this week. */
  usageVisitors: defineTable({
    week: v.string(),
    kind: usageKind,
    ipHash: v.string(),
  }).index("by_kind_week_hash", ["kind", "week", "ipHash"]),
});
