import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS_DIR = path.join(ROOT, "apps/web/content/docs");
const WIKI_DIR = path.join(ROOT, "wiki");

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
const TITLE_RE = /^title:\s*(.+)$/m;
const DESCRIPTION_RE = /^description:\s*(.+)$/m;
const SEPARATOR_RE = /^---(.+)---$/;
const CODE_FENCE_RE = /(^[ \t]*```[\s\S]*?^[ \t]*```)/m;
const MDX_COMMENT_RE = /\{\/\*[\s\S]*?\*\/\}/g;
const EXTRA_BLANK_LINES_RE = /\n{3,}/g;
const MDX_EXTENSION_RE = /\.mdx$/;
const CRLF_RE = /\r\n/g;

const PROJECT_NAME = "Cortexcn";

const SUMMARY =
  "> Cortexcn is a shadcn registry of React and Tailwind CSS components, page blocks, and charts. Items install with the shadcn CLI (`npx shadcn@latest add @cortexcn/<name>`, or `npx shadcn@latest add https://ui.cortexcn.dev/r/<name>.json`), which copies the source into the user's project, so there is no runtime package to update. The source lives in `packages/ui` (`@cortexcn/ui`), and the docs site and registry host is `apps/web` (Next.js and Fumadocs), served at https://ui.cortexcn.dev.";

const CONTEXT = [
  "Documentation source files live under `apps/web/content/docs/` (MDX). The workspace uses pnpm and Turborepo. `pnpm registry:build` writes the registry JSON to `apps/web/public/r/`, which is served at `https://ui.cortexcn.dev/r/{name}.json`, with the full index at `https://ui.cortexcn.dev/r/registry.json`. Chart demos are at `/charts/[slug]` and page blocks at `/blocks`.",
  'To use the `@cortexcn/<name>` form, a project adds `"@cortexcn": "https://ui.cortexcn.dev/r/{name}.json"` under `registries` in `components.json`. In a user\'s project, installed charts are imported from `@/components/charts`; `@cortexcn/ui` is the workspace package used only inside this repo.',
  "For coding agents there is a read-only MCP server at `https://ui.cortexcn.dev/mcp`, agent skills (`npx shadcn@latest add https://ui.cortexcn.dev/r/agent-skills.json`), and a DESIGN.md for the design system (`npx shadcn@latest add https://ui.cortexcn.dev/r/design-md.json`). Setup guides are at https://ui.cortexcn.dev/docs/integration.",
].join("\n\n");

/** Sidebar labels in `components/meta.json` that read better spelled out. */
const COMPONENT_LABELS = {
  Cortex: "Cortexcn Components",
};

const GETTING_STARTED = "Getting Started";
const CHART_UTILITIES = "Chart Utilities";
const AI_INTEGRATION = "AI Integration";
const DOCUMENTATION = "Documentation";
const DEFAULT_COMPONENT_SECTION = "Components";

function walkMdx(dir, base = dir) {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push(...walkMdx(full, base));
    } else if (name.endsWith(".mdx")) {
      entries.push(path.relative(base, full).split(path.sep).join("/"));
    }
  }
  return entries.sort();
}

function readDoc(rel) {
  return fs
    .readFileSync(path.join(DOCS_DIR, rel), "utf8")
    .replace(CRLF_RE, "\n");
}

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { title: "Untitled", description: "", body: raw };
  }
  const fm = match[1];
  const body = match[2];
  const title = fm.match(TITLE_RE)?.[1]?.trim() ?? "Untitled";
  const description = fm.match(DESCRIPTION_RE)?.[1]?.trim() ?? "";
  return { title, description, body };
}

/**
 * Drops MDX comments, which the site never renders, so llms-full.txt matches
 * what readers see. Code fences are left alone because JSX samples use the
 * same comment syntax.
 */
function stripMdxComments(body) {
  return body
    .split(new RegExp(CODE_FENCE_RE.source, "gm"))
    .map((part, i) => (i % 2 === 1 ? part : part.replace(MDX_COMMENT_RE, "")))
    .join("")
    .replace(EXTRA_BLANK_LINES_RE, "\n\n");
}

/** The `pages` list of a folder's Fumadocs `meta.json`, or an empty list. */
function metaPages(dirRel) {
  const file = path.join(DOCS_DIR, dirRel, "meta.json");
  if (!fs.existsSync(file)) {
    return [];
  }
  const meta = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(meta.pages) ? meta.pages : [];
}

/** Maps each component slug to the sidebar group it sits under. */
function componentSectionsBySlug() {
  const sections = new Map();
  let current = DEFAULT_COMPONENT_SECTION;
  for (const entry of metaPages("components")) {
    const separator = entry.match(SEPARATOR_RE);
    if (separator) {
      const label = separator[1].trim();
      current = COMPONENT_LABELS[label] ?? label;
      continue;
    }
    sections.set(entry, current);
  }
  return sections;
}

const componentSections = componentSectionsBySlug();

function sectionFor(relPath) {
  const segments = relPath.split("/");
  if (segments.length === 1) {
    return GETTING_STARTED;
  }
  if (segments[0] === "components") {
    const slug = segments[1].replace(MDX_EXTENSION_RE, "");
    return componentSections.get(slug) ?? DEFAULT_COMPONENT_SECTION;
  }
  if (segments[0] === "utility") {
    return CHART_UTILITIES;
  }
  if (segments[0] === "integration") {
    return AI_INTEGRATION;
  }
  return DOCUMENTATION;
}

/**
 * Sort key that follows the docs sidebar: each path segment is ranked by its
 * position in that folder's `meta.json`, index pages first, unlisted pages last.
 */
function sidebarKey(relPath) {
  const segments = relPath.replace(MDX_EXTENSION_RE, "").split("/");
  const key = [];
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment === "index") {
      key.push(-1);
      continue;
    }
    const position = metaPages(segments.slice(0, i).join("/")).indexOf(segment);
    key.push(position === -1 ? Number.MAX_SAFE_INTEGER : position);
  }
  return key;
}

function compareSidebar(a, b) {
  const keyA = sidebarKey(a);
  const keyB = sidebarKey(b);
  for (let i = 0; i < Math.min(keyA.length, keyB.length); i++) {
    if (keyA[i] !== keyB[i]) {
      return keyA[i] - keyB[i];
    }
  }
  return keyA.length - keyB.length || a.localeCompare(b);
}

const files = walkMdx(DOCS_DIR).sort(compareSidebar);
const bySection = new Map();

for (const rel of files) {
  const section = sectionFor(rel);
  if (!bySection.has(section)) {
    bySection.set(section, []);
  }
  const { title, description, body } = parseFrontmatter(readDoc(rel));
  bySection.get(section).push({ rel, title, description, body });
}

const sectionOrder = [
  GETTING_STARTED,
  ...new Set([DEFAULT_COMPONENT_SECTION, ...componentSections.values()]),
  CHART_UTILITIES,
  AI_INTEGRATION,
  DOCUMENTATION,
];

for (const section of bySection.keys()) {
  if (!sectionOrder.includes(section)) {
    sectionOrder.push(section);
  }
}

function header() {
  return [`# ${PROJECT_NAME}`, "", SUMMARY, "", CONTEXT, ""];
}

function buildIndex(docsPrefix, repoPrefix) {
  const lines = header();
  for (const section of sectionOrder) {
    const items = bySection.get(section);
    if (!items?.length) {
      continue;
    }
    lines.push(`## ${section}`, "");
    for (const { rel, title, description } of items) {
      const desc = description || `Documentation for ${title} in Cortexcn.`;
      lines.push(`- [${title}](${docsPrefix}${rel}): ${desc}`);
    }
    lines.push("");
  }
  lines.push("## Optional", "");
  lines.push(
    `- [Repository README](${repoPrefix}README.md): Install commands, AI integration, local development, and repository layout.`,
    `- [Contributor guide](${repoPrefix}AGENTS.md): Where code, docs, and registry files live, and how to add a chart or component.`,
    "- [Registry index](https://ui.cortexcn.dev/r/registry.json): Every installable item as shadcn registry JSON.",
  );
  lines.push("");
  return lines.join("\n");
}

function buildFull(docsPrefix) {
  const lines = header();
  for (const section of sectionOrder) {
    const items = bySection.get(section);
    if (!items?.length) {
      continue;
    }
    lines.push(`## ${section}`, "");
    for (const { rel, title, body } of items) {
      lines.push(
        `<doc title="${title}" path="${docsPrefix}${rel}">`,
        stripMdxComments(body).trim(),
        "</doc>",
        "",
      );
    }
  }
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(WIKI_DIR, { recursive: true });

const rootIndex = buildIndex("./apps/web/content/docs/", "./");
const wikiIndex = buildIndex("../apps/web/content/docs/", "../");
const wikiFull = buildFull("../apps/web/content/docs/");

fs.writeFileSync(path.join(ROOT, "llms.txt"), rootIndex);
fs.writeFileSync(path.join(WIKI_DIR, "llms.txt"), wikiIndex);
fs.writeFileSync(path.join(WIKI_DIR, "llms-full.txt"), wikiFull);

console.log(
  `Wrote llms.txt, wiki/llms.txt, wiki/llms-full.txt (${files.length} docs)`,
);
