import { createRateLimiter } from "@/lib/rate-limit";

/**
 * Six contact submissions per client in any ten minutes. Without Upstash
 * Redis it counts per server instance only, so it slows down floods; Redis,
 * or a Vercel Firewall rate limit rule, is the hard limit across instances.
 */
export const takeRateLimit = createRateLimiter("contact", [
  { limit: 6, windowSeconds: 10 * 60 },
]);
