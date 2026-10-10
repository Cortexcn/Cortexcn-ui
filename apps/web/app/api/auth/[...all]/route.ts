import { authServer } from "@/lib/auth-server";

/**
 * Better Auth's endpoints. Each request is passed through to the Convex
 * deployment, which runs Better Auth and sets the session cookie.
 */
function notSetUp() {
  return Response.json(
    { error: "Sign-in is not set up on this deployment." },
    { status: 503 },
  );
}

export function GET(request: Request) {
  return authServer ? authServer.handler.GET(request) : notSetUp();
}

export function POST(request: Request) {
  return authServer ? authServer.handler.POST(request) : notSetUp();
}
