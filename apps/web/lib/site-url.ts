/**
 * Canonical origin of the marketing site. The apex `cortexcn.dev` 308-redirects
 * here at the Vercel domain level, so it must not be used as a canonical URL.
 */
export const SITE_URL = "https://www.cortexcn.dev";

/** Canonical origin of the documentation and the shadcn registry (`/r/*`). */
export const DOCS_URL = "https://ui.cortexcn.dev";

const DOCS_PATH_RE = /^\/docs(?:\/|$)/;

export function isDocsPath(pathname: string) {
  return DOCS_PATH_RE.test(pathname);
}

/** Absolute canonical URL for a path, on whichever domain owns it. */
export function canonicalUrlFor(pathname: string) {
  return new URL(pathname, isDocsPath(pathname) ? DOCS_URL : SITE_URL).href;
}
