import { type NextRequest, NextResponse } from "next/server";
import {
  canonicalUrlFor,
  DOCS_URL,
  isDocsPath,
  SITE_URL,
} from "@/lib/site-url";

const SITE_HOST = new URL(SITE_URL).host;
const DOCS_HOST = new URL(DOCS_URL).host;
const APEX_HOST = SITE_HOST.replace(/^www\./, "");

// Loaded inside iframes and by crawlers, so they answer on whichever host asked.
const HOST_AGNOSTIC_PATH_RE =
  /^\/(?:studio\/(?:embed|demo|og-preview)(?:\/|$)|robots\.txt$|sitemap\.xml$)/;

/**
 * Where a production request should be sent instead, or null to serve it.
 * One deployment answers on both domains: docs live on ui.cortexcn.dev and
 * everything else on www.cortexcn.dev.
 */
function productionRedirectFor(host: string, pathname: string): URL | null {
  if (HOST_AGNOSTIC_PATH_RE.test(pathname)) {
    return null;
  }

  if (host === DOCS_HOST) {
    if (pathname === "/") {
      return new URL("/docs", DOCS_URL);
    }
    return isDocsPath(pathname) ? null : new URL(pathname, SITE_URL);
  }

  if (host === SITE_HOST) {
    return isDocsPath(pathname) ? new URL(pathname, DOCS_URL) : null;
  }

  // Vercel already redirects the apex; this covers a missing domain-level rule.
  if (host === APEX_HOST || host.endsWith(".vercel.app")) {
    return new URL(canonicalUrlFor(pathname));
  }

  return null;
}

export function proxy(request: NextRequest) {
  const host = (
    request.headers.get("host") ?? request.nextUrl.host
  ).toLowerCase();
  const { pathname, search } = request.nextUrl;

  if (process.env.VERCEL_ENV === "production") {
    const target = productionRedirectFor(host, pathname);
    if (target) {
      target.search = search;
      // The bare docs host is a landing redirect, so keep it changeable.
      const status = host === DOCS_HOST && pathname === "/" ? 307 : 308;
      return NextResponse.redirect(target, status);
    }
  }

  const response = NextResponse.next();
  response.headers.set(
    "Link",
    `<${canonicalUrlFor(pathname)}>; rel="canonical"`,
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
