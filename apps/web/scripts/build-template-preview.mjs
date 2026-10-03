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
// Free templates live in this repo; paid ones in the private
// cortexcn-templates repo, checked out next to this one.
const templateDir = [
  join(packageRoot, "../../templates", slug),
  join(packageRoot, "../../../cortexcn-templates", slug),
].find((dir) => existsSync(dir));
if (!templateDir) {
  console.error(
    `No template called ${slug} in templates/ or in ../cortexcn-templates/.`,
  );
  process.exit(1);
}
const exportDir = join(templateDir, "out");
const previewDir = join(packageRoot, "public/previews", slug);

// The template is its own project, not a workspace member. Bun installs the
// versions in the template's lockfile, and when that is a pnpm-lock.yaml it
// also writes a bun.lock; remove it so the template keeps only its own lockfile.
if (!existsSync(join(templateDir, "node_modules"))) {
  const bunLock = join(templateDir, "bun.lock");
  const hadBunLock = existsSync(bunLock);
  execSync("bun install --frozen-lockfile", {
    cwd: templateDir,
    stdio: "inherit",
  });
  if (!hadBunLock) {
    rmSync(bunLock, { force: true });
  }
}

rmSync(exportDir, { recursive: true, force: true });
execSync("bun x next build", {
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
