import { createMcpHandler } from "@modelcontextprotocol/server";
import { after } from "next/server";
import { createServer } from "@/lib/mcp/server";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";
import { DOCS_URL } from "@/lib/site-url";
import { logUsage, mcpEntries, requestIp } from "@/lib/usage-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The Cortexcn MCP server. Stateless and read-only: every request gets a
 * fresh server, answers in one JSON body, and needs no sign-in.
 */
const handler = createMcpHandler(createServer, { responseMode: "json" });

/**
 * Per client address: plenty for an agent working through a task, and low
 * enough that one address cannot use up the hosting quota. Chat apps such as
 * claude.ai and ChatGPT call from shared addresses, so keep these generous.
 */
const takeRateLimit = createRateLimiter("mcp", [
  { limit: 120, windowSeconds: 60 },
  { limit: 3000, windowSeconds: 24 * 60 * 60 },
]);

// Browser-based clients, such as the MCP Inspector, call it across origins.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers":
    "Mcp-Session-Id, Mcp-Protocol-Version, Retry-After",
};

function withCors(response: Response) {
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

function waitText(seconds: number) {
  if (seconds < 60) {
    return seconds === 1 ? "1 second" : `${seconds} seconds`;
  }
  if (seconds < 60 * 60) {
    const minutes = Math.ceil(seconds / 60);
    return minutes === 1 ? "1 minute" : `${minutes} minutes`;
  }
  const hours = Math.ceil(seconds / (60 * 60));
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

/** A JSON-RPC error, so the assistant can tell the user why and for how long. */
function tooManyRequests(retryAfterSeconds: number) {
  return withCors(
    Response.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32_000,
          message: `Too many requests to the Cortexcn MCP server from this address. Try again in ${waitText(retryAfterSeconds)}.`,
        },
        id: null,
      },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    ),
  );
}

async function serve(request: Request) {
  // Someone opening the URL in a browser gets the setup page instead.
  const accept = request.headers.get("accept") ?? "";
  if (request.method === "GET" && accept.includes("text/html")) {
    return Response.redirect(`${DOCS_URL}/docs/integration/mcp`, 307);
  }

  const limit = await takeRateLimit(clientIp(request) ?? "unknown");
  if (limit.limited) {
    return tooManyRequests(limit.retryAfterSeconds);
  }

  // Log each call for /admin/stats once the response is sent. Only requests
  // that pass the rate limit are logged.
  if (request.method === "POST") {
    const copy = request.clone();
    after(async () => {
      try {
        await logUsage(mcpEntries(await copy.json()), requestIp(request));
      } catch {
        // A body that is not JSON is the handler's problem, not the log's.
      }
    });
  }

  return withCors(await handler.fetch(request));
}

export { serve as DELETE, serve as GET, serve as POST };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
