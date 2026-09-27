const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

/**
 * Sliding-window limit on contact submissions per client. It counts per server
 * instance only, so it slows down floods; a Vercel Firewall rate limit rule is
 * the hard limit across instances.
 */
export function takeRateLimit(key: string, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0] ?? now;
    hits.set(key, recent);
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((oldest + WINDOW_MS - now) / 1000),
    };
  }

  if (!hits.has(key) && hits.size >= MAX_TRACKED_KEYS) {
    hits.clear();
  }
  recent.push(now);
  hits.set(key, recent);
  return { limited: false, retryAfterSeconds: 0 };
}
