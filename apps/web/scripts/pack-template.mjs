/**
 * Zip a template for a store listing (Lemon Squeezy, Gumroad, Polar, ...).
 * Paid templates are never served from this site, so this is how their zip
 * gets made. It skips the same files as the free download route.
 *
 * Usage:
 *   node apps/web/scripts/pack-template.mjs simplistic-saas
 * Writes apps/web/dist/templates/cortexcn-<slug>.zip (gitignored).
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zipSync } from "fflate";

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
const outDir = join(packageRoot, "dist/templates");
const name = `cortexcn-${slug}`;

const SKIPPED_NAMES = new Set([
  ".DS_Store",
  ".next",
  ".vercel",
  "next-env.d.ts",
  "node_modules",
  "out",
]);

function isSkipped(entryName) {
  return (
    SKIPPED_NAMES.has(entryName) ||
    entryName.endsWith(".tsbuildinfo") ||
    (entryName.startsWith(".env") && entryName !== ".env.example")
  );
}

function collectFiles(dir, prefix) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !isSkipped(entry.name))
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      const zipPath = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) {
        return collectFiles(path, zipPath);
      }
      return entry.isFile() ? [[zipPath, readFileSync(path)]] : [];
    });
}

const files = collectFiles(templateDir, name).sort(([a], [b]) =>
  a < b ? -1 : 1,
);
const archive = zipSync(Object.fromEntries(files), { level: 9 });

mkdirSync(outDir, { recursive: true });
const target = join(outDir, `${name}.zip`);
writeFileSync(target, archive);
console.log(
  `${files.length} files, ${(archive.length / 1024).toFixed(0)} KB: ${target}`,
);
