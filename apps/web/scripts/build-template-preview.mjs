/**
 * Build the live preview /templates links to: the template as a static site
 * under /previews/<slug>, copied into public/ so it deploys with this app.
 * Commit the result; rerun it whenever the template changes.
 *
 * Usage:
 *   node apps/web/scripts/build-template-preview.mjs simplistic-saas
 */

import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const slug = process.argv[2];
if (!slug) {
  console.error("Pass the template slug, for example: simplistic-saas");
  process.exit(1);
}

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = join(packageRoot, "../../templates", slug);
const exportDir = join(templateDir, "out");
const previewDir = join(packageRoot, "public/previews", slug);

if (!existsSync(templateDir)) {
  console.error(`No template folder at ${templateDir}`);
  process.exit(1);
}

// The template is its own project, not a workspace member.
if (!existsSync(join(templateDir, "node_modules"))) {
  execSync("pnpm install --ignore-workspace --frozen-lockfile", {
    cwd: templateDir,
    stdio: "inherit",
  });
}

rmSync(exportDir, { recursive: true, force: true });
execSync("pnpm exec next build", {
  cwd: templateDir,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_OUTPUT: "export",
    BASE_PATH: `/previews/${slug}`,
  },
});

// The preview is one page: route payloads, 404 pages, robots, the sitemap,
// and the share image stay behind.
const SKIPPED =
  /^(?:404|_not-found|__next\.|index\.txt$|robots\.txt$|sitemap\.xml$|opengraph-image)/;

rmSync(previewDir, { recursive: true, force: true });
cpSync(exportDir, previewDir, {
  recursive: true,
  filter: (source) => {
    const path = relative(exportDir, source).replaceAll("\\", "/");
    return !SKIPPED.test(path);
  },
});
rmSync(exportDir, { recursive: true, force: true });
console.log(`Preview ready at public/previews/${slug}`);
