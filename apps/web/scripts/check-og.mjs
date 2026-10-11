/*
 * Fails the build when an indexable page has no share image. pageMetadata()
 * in lib/seo.ts gives every page one; a page that writes its own metadata, or
 * replaces `openGraph` without images, loses it, and this names those pages.
 *
 * Runs after `next build` (the `build` script in package.json) and reads the
 * prerendered HTML in .next/server/app. Redirects, noindex pages, and Next's
 * own error pages are skipped; pages rendered per request aren't prerendered,
 * so they aren't checked.
 *
 *   node scripts/check-og.mjs
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = fileURLToPath(new URL("../.next/server/app", import.meta.url));

const REQUIRED_TAGS = ['property="og:image"', 'name="twitter:image"'];

const HTML_EXTENSION_RE = /\.html$/;
const INDEX_RE = /(^|\/)index$/;
const NOINDEX_RE = /<meta name="robots" content="[^"]*noindex/;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* htmlFiles(path);
    } else if (entry.name.endsWith(".html")) {
      yield path;
    }
  }
}

function routeOf(file) {
  const route = relative(APP_DIR, file)
    .split(sep)
    .join("/")
    .replace(HTML_EXTENSION_RE, "")
    .replace(INDEX_RE, "");
  return `/${route}`;
}

let checked = 0;
const missing = [];

try {
  for await (const file of htmlFiles(APP_DIR)) {
    const route = routeOf(file);
    // _not-found and _global-error.
    if (route.split("/").some((segment) => segment.startsWith("_"))) {
      continue;
    }
    const html = await readFile(file, "utf8");
    if (html.includes("NEXT_REDIRECT;") || NOINDEX_RE.test(html)) {
      continue;
    }
    checked += 1;
    const lacking = REQUIRED_TAGS.filter((tag) => !html.includes(tag));
    if (lacking.length > 0) {
      missing.push(`  ${route}  (no ${lacking.join(" or ")})`);
    }
  }
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

if (checked === 0) {
  console.error(
    "check-og: no prerendered pages in .next/server/app. Run `next build` first.",
  );
  process.exit(1);
}

if (missing.length > 0) {
  console.error(
    [
      `check-og: ${missing.length} of ${checked} pages have no share image:`,
      ...missing.sort(),
      "Build their metadata with pageMetadata() from lib/seo.ts, which adds the",
      "image, instead of writing openGraph and twitter by hand.",
    ].join("\n"),
  );
  process.exit(1);
}

console.log(`check-og: all ${checked} indexable pages have a share image.`);
