import { components } from "./_generated/api";
import { type QueryCtx, query } from "./_generated/server";
import { authComponent } from "./auth";

/** Rows read per table. Plenty for now; page through them once there are more. */
const MAX_ROWS = 1000;
const DAY_MS = 86_400_000;
const CHART_DAYS = 30;

interface UserDoc {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: number;
}

interface SessionDoc {
  userId: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
}

interface AccountDoc {
  userId: string;
  providerId: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: number;
  /** When the user's most recent session was last refreshed. */
  lastActiveAt: number | null;
  sessions: number;
  activeSessions: number;
  providers: string[];
}

/**
 * Emails allowed to see the dashboard, comma-separated, on the Convex
 * deployment: `bunx convex env set ADMIN_EMAILS you@example.com`.
 */
export function isAdmin(email: string) {
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
}

/** Rows from a Better Auth table. `select` keeps tokens and secrets out. */
async function readTable<T>(
  ctx: QueryCtx,
  model: "user" | "session" | "account",
  select?: string[],
) {
  const result = await ctx.runQuery(components.betterAuth.adapter.findMany, {
    model,
    select,
    paginationOpts: { cursor: null, numItems: MAX_ROWS },
  });
  return result.page as unknown as T[];
}

/** Whether the signed-in user may open the dashboard; drives the menu link. */
export const viewerIsAdmin = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await authComponent.safeGetAuthUser(ctx);
    return Boolean(viewer && isAdmin(viewer.email));
  },
});

/** Everything the admin dashboard shows, or null for anyone but an admin. */
export const overview = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await authComponent.safeGetAuthUser(ctx);
    if (!(viewer && isAdmin(viewer.email))) {
      return null;
    }

    const [users, sessions, accounts] = await Promise.all([
      readTable<UserDoc>(ctx, "user", [
        "_id",
        "name",
        "email",
        "image",
        "emailVerified",
        "createdAt",
      ]),
      readTable<SessionDoc>(ctx, "session", [
        "userId",
        "createdAt",
        "updatedAt",
        "expiresAt",
      ]),
      readTable<AccountDoc>(ctx, "account", ["userId", "providerId"]),
    ]);

    const now = Date.now();
    const rows: AdminUser[] = users
      .map((user) => {
        const own = sessions.filter((session) => session.userId === user._id);
        const lastActive = Math.max(
          ...own.map((session) => session.updatedAt ?? session.createdAt),
        );
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          lastActiveAt: Number.isFinite(lastActive) ? lastActive : null,
          sessions: own.length,
          activeSessions: own.filter((session) => session.expiresAt > now)
            .length,
          providers: [
            ...new Set(
              accounts
                .filter((account) => account.userId === user._id)
                .map((account) => account.providerId),
            ),
          ],
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);

    // Sign-ups per UTC day, oldest first, ending today.
    const today = Math.floor(now / DAY_MS) * DAY_MS;
    const signupsByDay = Array.from({ length: CHART_DAYS }, (_, index) => {
      const start = today - (CHART_DAYS - 1 - index) * DAY_MS;
      return {
        day: new Date(start).toISOString().slice(0, 10),
        signups: rows.filter(
          (user) => user.createdAt >= start && user.createdAt < start + DAY_MS,
        ).length,
      };
    });

    return {
      generatedAt: now,
      totals: {
        users: rows.length,
        newThisWeek: rows.filter((user) => user.createdAt >= now - 7 * DAY_MS)
          .length,
        activeToday: rows.filter(
          (user) =>
            user.lastActiveAt !== null && user.lastActiveAt >= now - DAY_MS,
        ).length,
        activeSessions: rows.reduce(
          (sum, user) => sum + user.activeSessions,
          0,
        ),
      },
      signupsByDay,
      users: rows,
    };
  },
});
