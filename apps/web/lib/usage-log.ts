/**
 * Logs registry and MCP requests to the Convex deployment's /usage/log route,
 * for /admin/stats. It never throws and never stores a raw IP: the address
 * is hashed with USAGE_LOG_SECRET first. Without the deployment URL or the
 * secret, it does nothing.
 */

export interface UsageEntry {
  kind: "registry" | "mcp";
  /** The registry item or component, or "" when there is none. */
  item: string;
  /** The MCP tool or method, for MCP calls. */
  tool?: string;
}

const convexSiteUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ??
  process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
    /\.convex\.cloud$/,
    ".convex.site",
  );

/** The caller's address, as the platform reports it. */
export function requestIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** HMAC-SHA256 of the IP, keyed with the secret, as hex. */
async function hashIp(ip: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function logUsage(entries: UsageEntry[], ip: string) {
  const secret = process.env.USAGE_LOG_SECRET;
  if (!(convexSiteUrl && secret) || entries.length === 0) {
    return;
  }
  try {
    const ipHash = await hashIp(ip, secret);
    await Promise.all(
      entries.map((entry) =>
        fetch(`${convexSiteUrl}/usage/log`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-usage-secret": secret,
          },
          body: JSON.stringify({ ...entry, ipHash }),
          signal: AbortSignal.timeout(3000),
        }),
      ),
    );
  } catch {
    // Logging is best effort; a failed write must never affect the visitor.
  }
}

const REGISTRY_FILE_RE = /^\/r\/([\w.-]+)\.json$/;

/** The item a registry file request is for, such as "marquee", or null. */
export function registryItem(pathname: string) {
  return REGISTRY_FILE_RE.exec(pathname)?.[1] ?? null;
}

interface JsonRpcMessage {
  method?: unknown;
  params?: { name?: unknown; arguments?: Record<string, unknown> };
}

/** The component an MCP tool call is about, from its arguments. */
function componentOf(args: Record<string, unknown> | undefined) {
  if (!args) {
    return "";
  }
  if (typeof args.name === "string") {
    return args.name;
  }
  if (Array.isArray(args.names)) {
    return args.names.filter((name) => typeof name === "string").join(",");
  }
  return typeof args.query === "string" ? `search: ${args.query}` : "";
}

/** One entry per JSON-RPC message in an MCP request body. */
export function mcpEntries(body: unknown): UsageEntry[] {
  const messages: unknown[] = Array.isArray(body) ? body : [body];
  return messages.flatMap((message) => {
    if (typeof message !== "object" || message === null) {
      return [];
    }
    const { method, params } = message as JsonRpcMessage;
    if (typeof method !== "string") {
      return [];
    }
    if (method === "tools/call" && typeof params?.name === "string") {
      return [
        {
          kind: "mcp" as const,
          tool: params.name,
          item: componentOf(params.arguments).slice(0, 200),
        },
      ];
    }
    return [{ kind: "mcp" as const, tool: method.slice(0, 100), item: "" }];
  });
}
