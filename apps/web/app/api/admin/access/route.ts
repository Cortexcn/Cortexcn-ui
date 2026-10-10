import { api } from "@/convex/_generated/api";
import { authServer } from "@/lib/auth-server";

// Reads the session cookie, so it answers per request.
export const dynamic = "force-dynamic";

/**
 * Whether the signed-in visitor is an admin, for the account menu's dashboard
 * link. The admin list stays on the Convex deployment, out of the browser.
 */
export async function GET() {
  if (!authServer) {
    return Response.json({ admin: false });
  }
  try {
    const admin = await authServer.fetchAuthQuery(api.admin.viewerIsAdmin);
    return Response.json({ admin });
  } catch {
    return Response.json({ admin: false });
  }
}
