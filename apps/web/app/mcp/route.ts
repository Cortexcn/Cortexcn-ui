import { createMcpHandler } from "@modelcontextprotocol/server";
import { createServer } from "@/lib/mcp/server";
import { DOCS_URL } from "@/lib/site-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The Cortexcn MCP server. Stateless and read-only: every request gets a
 * fresh server, answers in one JSON body, and needs no sign-in.
 */
const handler = createMcpHandler(createServer, { responseMode: "json" });

// Browser-based clients, such as the MCP Inspector, call it across origins.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

async function serve(request: Request) {
  // Someone opening the URL in a browser gets the setup page instead.
  const accept = request.headers.get("accept") ?? "";
  if (request.method === "GET" && accept.includes("text/html")) {
    return Response.redirect(`${DOCS_URL}/docs/integration/mcp`, 307);
  }
  const response = await handler.fetch(request);
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(CORS_HEADERS)) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export { serve as DELETE, serve as GET, serve as POST };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
