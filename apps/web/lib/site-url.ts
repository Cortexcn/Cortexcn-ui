/**
 * Canonical origin of the marketing site. The apex `cortexcn.dev` 308-redirects
 * here at the Vercel domain level, so it must not be used as a canonical URL.
 */
export const SITE_URL = "https://www.cortexcn.dev";

/**
 * Canonical origin of the component library site: its home page, the docs, the
 * blocks and chart galleries, and the shadcn registry (`/r/*`).
 */
export const DOCS_URL = "https://ui.cortexcn.dev";

/**
 * Local stand-in for the library host. Browsers resolve every `*.localhost`
 * name to this machine, so `http://ui.localhost:3000` works like
 * ui.cortexcn.dev in dev.
 */
export const DEV_DOCS_HOSTNAME = "ui.localhost";

/**
 * Internal route of the component library home. The proxy rewrites `/` on the
 * library host to it and sends direct visits to that root, so it never shows
 * up in the address bar.
 */
export const LIBRARY_HOME_ROUTE = "/ui-home";

const LIBRARY_PATH_RE = /^\/(?:docs|blocks|charts|changelog)(?:\/|$)/;

/** Pages of the component library site: the docs, the two galleries, and the changelog. */
export function isLibraryPath(pathname: string) {
  return LIBRARY_PATH_RE.test(pathname);
}

/** Absolute canonical URL for a path, on whichever domain owns it. */
export function canonicalUrlFor(pathname: string) {
  if (pathname === LIBRARY_HOME_ROUTE) {
    return `${DOCS_URL}/`;
  }
  return new URL(pathname, isLibraryPath(pathname) ? DOCS_URL : SITE_URL).href;
}
