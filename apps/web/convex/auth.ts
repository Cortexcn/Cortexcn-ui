import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";

import devPorts from "../dev-ports.json";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import authConfig from "./auth.config";

/**
 * Set on the Convex deployment with `bunx convex env set`: the site port from
 * dev-ports.json (http://localhost:4410) in development, and
 * https://ui.cortexcn.dev in production. Google sends users back to
 * `${SITE_URL}/api/auth/callback/google`.
 */
const siteUrl = process.env.SITE_URL ?? `http://localhost:${devPorts.site}`;

/** The library and the services site share one sign-in on this domain. */
const PRODUCTION_DOMAIN = "cortexcn.dev";
const isProduction = new URL(siteUrl).hostname.endsWith(PRODUCTION_DOMAIN);

/** In dev each site has its own port; sign-in works from all of them. */
const devOrigins = Object.values(devPorts).map(
  (port) => `http://localhost:${port}`,
);

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
    trustedOrigins: isProduction
      ? ["https://ui.cortexcn.dev", "https://www.cortexcn.dev"]
      : [siteUrl, ...devOrigins],
    // In production the session cookie is set on .cortexcn.dev, so www sees it too.
    ...(isProduction && {
      advanced: {
        crossSubDomainCookies: { enabled: true, domain: PRODUCTION_DOMAIN },
      },
    }),
    plugins: [convex({ authConfig })],
  });

/** The signed-in user, or null for a visitor. */
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => (await authComponent.safeGetAuthUser(ctx)) ?? null,
});
