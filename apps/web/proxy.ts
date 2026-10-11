import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import {
  canonicalUrlFor,
  DEV_DOCS_HOSTNAME,
  DOCS_URL,
  isLibraryPath,
  LIBRARY_HOME_ROUTE,
  SITE_URL,
} from "@/lib/site-url";
import { logUsage, registryItem, requestIp } from "@/lib/usage-log";
import devPorts from "./dev-ports.json";

const SITE_HOST = new URL(SITE_URL).host;
const DOCS_HOST = new URL(DOCS_URL).host;
const APEX_HOST = SITE_HOST.replace(/^www\./, "");
const IS_DEV = process.env.NODE_ENV === "development";

/** In dev, `bun run dev` serves each site on its own port (dev-ports.json). */
const DEV_LIBRARY_PORTS = new Set([
  String(devPorts.library),
  String(devPorts.components),
]);
const DEV_COMPONENTS_PORT = String(devPorts.components);

// Read by crawlers, so they answer on whichever host asked. Each host serves
// its own pages' share images from /og.
const HOST_AGNOSTIC_PATH_RE = /^\/(?:robots\.txt|sitemap\.xml|og)$/;

/** Paths that mean the library home, which only ever shows as `/` on its host. */
const LIBRARY_HOME_ALIASES = new Set([LIBRARY_HOME_ROUTE, "/components"]);

/** Whether this host serves the component library site at its root. */
function isLibraryHost(host: string) {
  if (host === DOCS_HOST) {
    return true;
  }
  const [hostname, port = ""] = host.split(":");
  return (
    IS_DEV && (hostname === DEV_DOCS_HOSTNAME || DEV_LIBRARY_PORTS.has(port))
  );
}

/** The library home: ui.cortexcn.dev, or its own port in dev. */
function libraryHomeUrl() {
  if (!IS_DEV) {
    return new URL("/", DOCS_URL);
  }
  return new URL(`http://localhost:${devPorts.library}/`);
}

/**
 * Where a production request should be sent instead, or null to serve it.
 * One deployment answers on both domains: the component library (its home,
 * docs, blocks, charts, and registry) lives on ui.cortexcn.dev, and
 * everything else on www.cortexcn.dev.
 */
function productionRedirectFor(host: string, pathname: string): URL | null {
  if (HOST_AGNOSTIC_PATH_RE.test(pathname)) {
    return null;
  }

  if (host === DOCS_HOST) {
    if (pathname === "/") {
      return null;
    }
    return isLibraryPath(pathname) ? null : new URL(pathname, SITE_URL);
  }

  if (host === SITE_HOST) {
    return isLibraryPath(pathname) ? new URL(pathname, DOCS_URL) : null;
  }

  // Vercel already redirects the apex; this covers a missing domain-level rule.
  if (host === APEX_HOST || host.endsWith(".vercel.app")) {
    return new URL(canonicalUrlFor(pathname));
  }

  return null;
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const host = (
    request.headers.get("host") ?? request.nextUrl.host
  ).toLowerCase();
  const { pathname, search } = request.nextUrl;

  // Registry files (/r/<name>.json) are served as they always were; the
  // request is only logged for /admin/stats, after the response is sent.
  const item = registryItem(pathname);
  if (item !== null) {
    event.waitUntil(logUsage([{ kind: "registry", item }], requestIp(request)));
    return NextResponse.next();
  }
  const isProduction = process.env.VERCEL_ENV === "production";

  // Direct visits to the library home's route go to the root of its host.
  // Preview deployments have no library host, so they serve the route as is.
  if (LIBRARY_HOME_ALIASES.has(pathname) && (isProduction || IS_DEV)) {
    const target = libraryHomeUrl();
    target.search = search;
    // Temporary in dev, so browsers do not cache it while the setup changes.
    return NextResponse.redirect(target, IS_DEV ? 307 : 308);
  }

  if (isProduction) {
    const target = productionRedirectFor(host, pathname);
    if (target) {
      target.search = search;
      return NextResponse.redirect(target, 308);
    }
  }

  // In dev, the components port opens on the components docs.
  if (
    IS_DEV &&
    pathname === "/" &&
    host.split(":")[1] === DEV_COMPONENTS_PORT
  ) {
    return NextResponse.redirect(
      new URL("/docs/components", `http://${host}`),
      307,
    );
  }

  // The library host opens on the component library home.
  if (pathname === "/" && isLibraryHost(host)) {
    const libraryHome = request.nextUrl.clone();
    libraryHome.pathname = LIBRARY_HOME_ROUTE;
    const response = NextResponse.rewrite(libraryHome);
    response.headers.set(
      "Link",
      `<${canonicalUrlFor(LIBRARY_HOME_ROUTE)}>; rel="canonical"`,
    );
    return response;
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
    // Registry files, only to log them; see the top of `proxy`.
    "/r/:path*",
  ],
};
