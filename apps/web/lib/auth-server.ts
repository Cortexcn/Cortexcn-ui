import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Where the deployment serves HTTP routes, including Better Auth. Locally it
 * comes from .env; in production it is derived from the deployment URL.
 */
const convexSiteUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
  convexUrl?.replace(/\.convex\.cloud$/, ".convex.site");

/**
 * Server helpers for sign-in, or null when no Convex deployment is configured,
 * so the rest of the site still builds and runs without one.
 */
export const authServer =
  convexUrl && convexSiteUrl
    ? convexBetterAuthNextJs({ convexUrl, convexSiteUrl })
    : null;
