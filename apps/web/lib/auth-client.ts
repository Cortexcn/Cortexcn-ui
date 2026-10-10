import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/** Browser side of sign-in. It talks to /api/auth on the current host. */
export const authClient = createAuthClient({
  plugins: [convexClient()],
});

/** Sign-in needs a Convex deployment; without one (a fresh clone) it stays off. */
export const isAuthEnabled = Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
