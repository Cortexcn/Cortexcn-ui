/**
 * Checks every system in design-systems/ (`bun run validate:ds`):
 * - the four files exist, and tokens.json and meta.json match the schema;
 * - theme.css is what tokens.json generates (`bun run ds:build` fixes it);
 * - DESIGN.md carries its source and "unofficial, inspired-by" header;
 * - every token is either traced to the DESIGN.md (meta.mapping) or
 *   explained by a gap, so nothing is invented silently;
 * - every text pair below WCAG AA is listed as a contrast gap;
 * - there are at least 25 systems.
 */
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { checkContrast } from "../design-systems/_schema/color";
import { themeCss } from "../design-systems/_schema/css";
import {
  listSystemIds,
  readSystemFile,
  SYSTEM_FILES,
} from "../design-systems/_schema/load";
import {
  type DesignMeta,
  type Gap,
  metaSchema,
} from "../design-systems/_schema/meta";
import {
  type DesignTokens,
  tokensSchema,
} from "../design-systems/_schema/tokens";

const ROOT = resolve(import.meta.dirname, "../design-systems");
const MIN_SYSTEMS = 25;
const UNOFFICIAL = /unofficial/i;
const WHITESPACE = /\s+/g;

/** Every leaf path in tokens.json, such as `modes.light.primary`. */
function leafPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function covers(gap: Gap, path: string) {
  return gap.path.endsWith(".*")
    ? path.startsWith(gap.path.slice(0, -1))
    : gap.path === path;
}

/** Parses both JSON files; returns the problems when either fails. */
function parse(id: string) {
  const tokens = tokensSchema.safeParse(
    JSON.parse(readSystemFile(ROOT, id, "tokens.json")),
  );
  const meta = metaSchema.safeParse(
    JSON.parse(readSystemFile(ROOT, id, "meta.json")),
  );
  const problems = [
    ...(tokens.error?.issues ?? []).map(
      (issue) => `tokens.json ${issue.path.join(".")}: ${issue.message}`,
    ),
    ...(meta.error?.issues ?? []).map(
      (issue) => `meta.json ${issue.path.join(".")}: ${issue.message}`,
    ),
  ];
  return { tokens: tokens.data, meta: meta.data, problems };
}

/** theme.css must be the generated output (formatting aside). */
function checkFiles(id: string, tokens: DesignTokens, meta: DesignMeta) {
  const problems: string[] = [];
  if (tokens.id !== id || meta.id !== id) {
    problems.push(
      `id mismatch: folder ${id}, tokens ${tokens.id}, meta ${meta.id}`,
    );
  }
  const squash = (css: string) => css.replace(WHITESPACE, "");
  const expected = themeCss(tokens, {
    name: meta.name,
    disclaimer: meta.source.disclaimer,
  });
  if (squash(readSystemFile(ROOT, id, "theme.css")) !== squash(expected)) {
    problems.push("theme.css is out of date; run `bun run ds:build`");
  }
  const design = readSystemFile(ROOT, id, "DESIGN.md");
  if (!(design.includes(meta.source.url) && UNOFFICIAL.test(design))) {
    problems.push(
      "DESIGN.md lacks the source and unofficial, inspired-by header",
    );
  }
  return problems;
}

/** Every token is mapped or covered by a gap, and nothing points nowhere. */
function checkProvenance(tokens: DesignTokens, meta: DesignMeta) {
  const problems: string[] = [];
  const paths = leafPaths(tokens).filter(
    (path) => path !== "id" && path !== "$schema",
  );
  const known = new Set(paths);
  const untraced = paths.filter(
    (path) =>
      meta.mapping[path] === undefined &&
      !meta.gaps.some((gap) => covers(gap, path)),
  );
  if (untraced.length > 0) {
    const shown = untraced.slice(0, 6).join(", ");
    problems.push(
      `${untraced.length} token(s) neither mapped nor in gaps: ${shown}${untraced.length > 6 ? ", ..." : ""}`,
    );
  }
  for (const path of Object.keys(meta.mapping)) {
    if (!known.has(path)) {
      problems.push(`mapping names an unknown token: ${path}`);
    }
  }
  for (const gap of meta.gaps) {
    if (!paths.some((path) => covers(gap, path))) {
      problems.push(`gap names an unknown token: ${gap.path}`);
    }
  }
  return problems;
}

/** Every pair under WCAG AA appears in gaps as a contrast entry. */
function checkContrastGaps(tokens: DesignTokens, meta: DesignMeta) {
  const problems: string[] = [];
  for (const mode of ["light", "dark"] as const) {
    for (const result of checkContrast(tokens.modes[mode])) {
      const path = `modes.${mode}.${result.foreground}`;
      const listed = meta.gaps.some(
        (gap) =>
          gap.kind === "contrast" &&
          gap.path === path &&
          gap.against === result.background,
      );
      if (!(result.passes || listed)) {
        problems.push(
          `contrast ${path} on ${result.background} is ${result.ratio}:1 and not listed in gaps (try ${result.suggested})`,
        );
      }
    }
  }
  return problems;
}

function validate(id: string): string[] {
  const missing = SYSTEM_FILES.filter(
    (file) => !existsSync(join(ROOT, id, file)),
  );
  if (missing.length > 0) {
    return [`missing ${missing.join(", ")}`];
  }
  const { tokens, meta, problems } = parse(id);
  if (!(tokens && meta)) {
    return problems;
  }
  return [
    ...checkFiles(id, tokens, meta),
    ...checkProvenance(tokens, meta),
    ...checkContrastGaps(tokens, meta),
  ];
}

const ids = listSystemIds(ROOT);
const strays = readdirSync(ROOT, { withFileTypes: true }).filter(
  (entry) =>
    entry.isDirectory() &&
    !entry.name.startsWith("_") &&
    !ids.includes(entry.name),
);
let failed = false;
for (const stray of strays) {
  failed = true;
  console.error(`x ${stray.name}: no tokens.json`);
}
for (const id of ids) {
  const problems = validate(id);
  if (problems.length === 0) {
    console.log(`ok ${id}`);
    continue;
  }
  failed = true;
  console.error(`x ${id}`);
  for (const problem of problems) {
    console.error(`    ${problem}`);
  }
}
if (ids.length < MIN_SYSTEMS) {
  failed = true;
  console.error(`Only ${ids.length} systems; at least ${MIN_SYSTEMS} needed.`);
}
console.log(`\n${ids.length} systems checked.`);
process.exit(failed ? 1 : 0);
