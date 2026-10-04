import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/** At most `limit` requests from one client in any `windowSeconds`. */
export interface RateLimitWindow {
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  limited: boolean;
  /** Whole seconds until the client may try again, or 0 when not limited. */
  retryAfterSeconds: number;
}

/** After this long without an answer from Redis, the local count decides. */
const REDIS_TIMEOUT_MS = 1000;
const MAX_TRACKED_KEYS = 5000;

/** Vercel sets these from the connecting address, so they are safe to key on. */
export function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  );
}

let redis: Redis | null | undefined;

/**
 * Upstash Redis, when its REST URL and token are set. The Upstash console
 * names them UPSTASH_REDIS_REST_*, and the Vercel Marketplace integration
 * names them KV_REST_API_*.
 */
function sharedRedis() {
  if (redis === undefined) {
    const url =
      process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
    const token =
      process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
    // One quick retry: more would only run into the timeout below.
    redis =
      url && token
        ? new Redis({ url, token, retry: { retries: 1, backoff: () => 50 } })
        : null;
  }
  return redis;
}

/** Requests counted in the current fixed window and in the one before it. */
interface WindowCount {
  start: number;
  current: number;
  previous: number;
}

/**
 * A sliding window counter for one server instance. The previous window's
 * count is weighted by how much of it still overlaps the last `windowSeconds`,
 * which is how Upstash's slidingWindow counts too.
 */
function createLocalWindow({ limit, windowSeconds }: RateLimitWindow) {
  const windowMs = windowSeconds * 1000;
  const counts = new Map<string, WindowCount>();

  function countFor(key: string, now: number): WindowCount {
    const start = now - (now % windowMs);
    const count = counts.get(key);
    if (count?.start === start) {
      return count;
    }
    const previous = count?.start === start - windowMs ? count.current : 0;
    return { start, current: 0, previous };
  }

  function makeRoom(now: number) {
    for (const [key, count] of counts) {
      if (count.start + 2 * windowMs <= now) {
        counts.delete(key);
      }
    }
    if (counts.size >= MAX_TRACKED_KEYS) {
      counts.clear();
    }
  }

  return {
    /** Seconds to wait if one more request would go over the limit, or 0. */
    wait(key: string, now: number) {
      const count = countFor(key, now);
      const overlap = 1 - (now - count.start) / windowMs;
      if (count.previous * overlap + count.current < limit) {
        return 0;
      }
      return Math.ceil((count.start + windowMs - now) / 1000);
    },
    record(key: string, now: number) {
      const count = countFor(key, now);
      count.current += 1;
      if (!counts.has(key) && counts.size >= MAX_TRACKED_KEYS) {
        makeRoom(now);
      }
      counts.set(key, count);
    },
  };
}

function result(retryAfterSeconds: number): RateLimitResult {
  return { limited: retryAfterSeconds > 0, retryAfterSeconds };
}

/**
 * A limit per client across one or more windows, such as a burst limit per
 * minute and a cap per day. Each server instance counts on its own, and with
 * Upstash Redis set up the count is also shared across every instance. If
 * Redis fails or is slow, the local count decides, so the limit never takes
 * the route down.
 */
export function createRateLimiter(name: string, windows: RateLimitWindow[]) {
  const local = windows.map(createLocalWindow);
  let shared: Ratelimit[] | undefined;
  let reportedFailure = false;

  function reportFailure(detail: unknown) {
    if (!reportedFailure) {
      reportedFailure = true;
      console.error(
        `The "${name}" rate limit could not reach Redis, so it counts per instance.`,
        detail,
      );
    }
  }

  function sharedWindows() {
    if (shared === undefined) {
      const client = sharedRedis();
      shared = client
        ? windows.map(
            ({ limit, windowSeconds }) =>
              new Ratelimit({
                redis: client,
                limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
                prefix: `cortexcn:rate-limit:${name}:${windowSeconds}s`,
                timeout: REDIS_TIMEOUT_MS,
              }),
          )
        : [];
    }
    return shared;
  }

  return async function takeRateLimit(key: string): Promise<RateLimitResult> {
    const now = Date.now();

    // Over the limit on this instance means over it everywhere, so Redis is
    // only asked about requests that pass here.
    const localWait = Math.max(...local.map((window) => window.wait(key, now)));
    if (localWait > 0) {
      return result(localWait);
    }
    for (const window of local) {
      window.record(key, now);
    }

    const limiters = sharedWindows();
    if (limiters.length === 0) {
      return result(0);
    }
    try {
      const answers = await Promise.all(
        limiters.map((limiter) => limiter.limit(key)),
      );
      // A timed-out check lets the request through, so only the local count held.
      if (answers.some(({ reason }) => reason === "timeout")) {
        reportFailure(`No answer within ${REDIS_TIMEOUT_MS} ms.`);
      }
      const sharedWait = Math.max(
        ...answers.map(({ success, reset }) =>
          success ? 0 : Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
        ),
      );
      return result(sharedWait);
    } catch (error) {
      reportFailure(error);
      return result(0);
    }
  };
}
