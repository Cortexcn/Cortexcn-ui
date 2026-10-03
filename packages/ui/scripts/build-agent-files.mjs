/**
 * Builds the files Cortexcn publishes for coding agents:
 *
 * - `src/agents/DESIGN.md`, in the DESIGN.md format from Google Labs
 *   (https://github.com/google-labs-code/design.md), with its tokens read from
 *   `src/styles/cortexcn-tokens.css`, so it always matches the components.
 * - The agent skills in `src/agents/skills`, copied to the docs site under
 *   `/.well-known/agent-skills/`, where `npx skills add https://ui.cortexcn.dev`
 *   finds them.
 *
 * Run it after changing the tokens or a skill: `bun run --filter @cortexcn/ui agents:build`.
 */

import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const uiRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokensPath = join(uiRoot, "src/styles/cortexcn-tokens.css");
const tailwindThemePath = join(uiRoot, "node_modules/tailwindcss/theme.css");
const agentsDir = join(uiRoot, "src/agents");
const skillsDir = join(agentsDir, "skills");
const wellKnownDir = join(
  uiRoot,
  "../../apps/web/public/.well-known/agent-skills",
);

const DECLARATION = /--([\w-]+):\s*([^;]+);/g;
const VAR_REFERENCE = /^var\(--([\w-]+)\)$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;
const DESCRIPTION_LINE = /^description:\s*(.+)$/m;

/** The custom properties declared in the first block that opens with `selector`. */
function readBlock(css, selector) {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) {
    throw new Error(`No "${selector}" block in ${tokensPath}`);
  }
  const end = css.indexOf("\n}", start);
  const body = css.slice(start, end);
  return new Map(
    [...body.matchAll(DECLARATION)].map((m) => [m[1], m[2].trim()]),
  );
}

/** Follows `var(--x)` until it reaches a real color. */
function resolve(value, scopes, depth = 0) {
  const reference = VAR_REFERENCE.exec(value);
  if (!reference || depth > 8) {
    return value;
  }
  for (const scope of scopes) {
    const next = scope.get(reference[1]);
    if (next) {
      return resolve(next, scopes, depth + 1);
    }
  }
  return value;
}

const COLOR_ROLES = [
  ["background", "The page."],
  ["foreground", "Body text and icons on the page."],
  ["card", "Raised surfaces: cards, panels, and code blocks."],
  ["card-foreground", "Text on cards."],
  ["popover", "Menus, popovers, and tooltips."],
  ["popover-foreground", "Text in menus and popovers."],
  ["primary", "The main action: primary buttons, active states."],
  ["primary-foreground", "Text and icons on primary."],
  ["secondary", "Secondary buttons and quiet fills."],
  ["secondary-foreground", "Text on secondary."],
  ["muted", "Subtle fills: hover rows, tracks, skeletons."],
  ["muted-foreground", "Secondary text, captions, placeholders."],
  ["accent", "Hovered and selected items in menus and lists."],
  ["accent-foreground", "Text on accent."],
  ["destructive", "Errors and destructive actions."],
  ["border", "Hairlines between surfaces, and outlines."],
  ["input", "Form control borders and fills."],
  ["ring", "Focus rings."],
  ["chart-1", "First data series."],
  ["chart-2", "Second data series."],
  ["chart-3", "Third data series."],
  ["chart-4", "Fourth data series."],
  ["chart-5", "Fifth data series."],
];

function yamlString(value) {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

/**
 * Component tokens in the DESIGN.md format, each with a `-dark` variant that
 * reads the dark palette. Borders are described in the prose, since the
 * format has no border sub-token.
 */
const COMPONENTS = [
  [
    "button-primary",
    { backgroundColor: "primary", textColor: "primary-foreground" },
    {
      typography: "{typography.label}",
      rounded: "{rounded.md}",
      height: "36px",
      padding: "10px",
    },
  ],
  [
    "button-secondary",
    { backgroundColor: "secondary", textColor: "secondary-foreground" },
    {
      typography: "{typography.label}",
      rounded: "{rounded.md}",
      height: "36px",
      padding: "10px",
    },
  ],
  [
    "button-outline",
    { backgroundColor: "background", textColor: "foreground" },
    {
      typography: "{typography.label}",
      rounded: "{rounded.md}",
      height: "36px",
      padding: "10px",
    },
  ],
  [
    "button-ghost",
    { backgroundColor: "background", textColor: "foreground" },
    {
      typography: "{typography.label}",
      rounded: "{rounded.md}",
      height: "36px",
      padding: "10px",
    },
  ],
  [
    "button-destructive",
    { backgroundColor: "background", textColor: "destructive" },
    {
      typography: "{typography.label}",
      rounded: "{rounded.md}",
      height: "36px",
      padding: "10px",
    },
  ],
  [
    "input",
    { backgroundColor: "background", textColor: "foreground" },
    {
      typography: "{typography.body-sm}",
      rounded: "{rounded.md}",
      height: "36px",
      padding: "10px",
    },
  ],
  [
    "card",
    { backgroundColor: "card", textColor: "card-foreground" },
    { rounded: "{rounded.lg}", padding: "24px" },
  ],
  [
    "popover",
    { backgroundColor: "popover", textColor: "popover-foreground" },
    { rounded: "{rounded.md}", padding: "4px" },
  ],
  [
    "menu-item-active",
    { backgroundColor: "accent", textColor: "accent-foreground" },
    {
      typography: "{typography.body-sm}",
      rounded: "{rounded.sm}",
      padding: "6px",
    },
  ],
  [
    "caption",
    { backgroundColor: "background", textColor: "muted-foreground" },
    { typography: "{typography.caption}" },
  ],
  ["skeleton", { backgroundColor: "muted" }, { rounded: "{rounded.md}" }],
  ["divider", { backgroundColor: "border" }, { height: "1px" }],
  [
    "switch-track",
    { backgroundColor: "input" },
    { rounded: "{rounded.full}", height: "18px", width: "32px" },
  ],
  ["focus-ring", { backgroundColor: "ring" }, { width: "3px" }],
  ["chart-series-1", { backgroundColor: "chart-1" }, { size: "10px" }],
  ["chart-series-2", { backgroundColor: "chart-2" }, { size: "10px" }],
  ["chart-series-3", { backgroundColor: "chart-3" }, { size: "10px" }],
  ["chart-series-4", { backgroundColor: "chart-4" }, { size: "10px" }],
  ["chart-series-5", { backgroundColor: "chart-5" }, { size: "10px" }],
];

function componentBlock(name, colors, rest, suffix) {
  const lines = [`  ${name}${suffix}:`];
  for (const [key, token] of Object.entries(colors)) {
    lines.push(`    ${key}: "{colors.${token}${suffix}}"`);
  }
  for (const [key, value] of Object.entries(rest)) {
    lines.push(
      `    ${key}: ${value.startsWith("{") ? yamlString(value) : value}`,
    );
  }
  return lines.join("\n");
}

function componentTokens() {
  return COMPONENTS.flatMap(([name, colors, rest]) => [
    componentBlock(name, colors, rest, ""),
    componentBlock(name, colors, rest, "-dark"),
  ]).join("\n");
}

function frontMatter(light, dark) {
  const colors = COLOR_ROLES.flatMap(([name]) => [
    `  ${name}: ${yamlString(light.get(name))}`,
    `  ${name}-dark: ${yamlString(dark.get(name) ?? light.get(name))}`,
  ]);
  return `---
version: alpha
name: Cortexcn
description: A square, quiet interface system for React and Tailwind CSS. Neutral surfaces, hairline borders, no rounded corners, and one set of tokens for light and dark mode.
colors:
${colors.join("\n")}
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1.875rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.025em
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  body-md:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-sm:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0em
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0em
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0em
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
components:
${componentTokens()}
---`;
}

function colorTable(light, dark) {
  const rows = COLOR_ROLES.map(
    ([name, use]) =>
      `| \`${name}\` | \`${light.get(name)}\` | \`${dark.get(name) ?? light.get(name)}\` | ${use} |`,
  );
  return [
    "| Token | Light | Dark | Use for |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function body(light, dark) {
  return `
# Cortexcn

## Overview

Cortexcn is a set of React components, page blocks, and charts built with Tailwind CSS and shadcn conventions. The look is square and quiet: neutral surfaces, one-pixel borders, no rounded corners, and color used for meaning rather than decoration. Everything is driven by CSS custom properties, so the same components work in light and dark mode and follow a project's own theme.

This file is generated from \`cortexcn-tokens.css\`. The front matter holds the tokens; the sections below explain how to use them. When a request conflicts with these rules, follow the rules and say so.

## Colors

Use colors only through the theme tokens, as Tailwind classes: \`bg-background\`, \`text-foreground\`, \`bg-card\`, \`bg-muted\`, \`text-muted-foreground\`, \`border-border\`, \`bg-primary\`, \`text-primary-foreground\`, \`bg-destructive\`, \`ring-ring\`, and \`fill-chart-1\` to \`fill-chart-5\` for data. Tints are opacity on a token (\`bg-primary/10\`, \`border-border/60\`), never a new color.

Dark mode is the \`.dark\` class on an ancestor, usually \`<html>\`. It swaps every token at once, so components never need their own dark colors. The \`-dark\` keys in the front matter are the values under \`.dark\`.

${colorTable(light, dark)}

Charts read their own tokens as well (\`--chart-grid\`, \`--chart-crosshair\`, \`--chart-tooltip-background\`, \`--legend\`, and the \`--chart-scale-01\` to \`--chart-scale-05\` sequential scale). They come with the chart registry items and follow the palette above.

## Typography

Interface text uses the project's sans font. Cortexcn's own site sets Geist; any neutral sans works.

- Default control and body size in components is \`text-sm\` (14px). Long-form text is \`text-base\` (16px).
- Labels, buttons, and table headers are \`font-medium\`. Headings are \`font-semibold\` with \`tracking-tight\` and \`text-balance\`.
- Secondary text is \`text-muted-foreground\`, not a lighter weight.
- Numbers that line up or change, such as stats, prices, and tables, use \`tabular-nums\`.
- Code and keyboard keys use the mono font at \`text-xs\` or \`text-sm\`.

## Layout

Spacing follows Tailwind's 4px scale. Inside controls the gap is \`gap-1.5\` (6px); between related items \`gap-2\` to \`gap-4\`; between sections \`gap-12\` to \`gap-24\`.

- Controls are \`h-9\` (36px) by default, \`h-8\` small, \`h-10\` large, with \`px-2.5\` padding.
- Cards and panels use \`p-6\` (24px), or \`p-4\` when dense.
- Page content sits in a centered container with \`px-4\` on phones and \`px-6\` or more on wider screens.
- Lay out with flex and grid gaps, not margins between siblings.

## Elevation & Depth

Depth comes from borders and surface color first. A card is \`bg-card\` with \`border-border\` on a \`bg-background\` page. Shadows are rare and soft (\`shadow-xs\` on outline buttons, \`shadow-sm\` on floating elements), and in dark mode the shadow token is transparent, so borders carry the separation.

## Shapes

Corners are square. \`--radius\` is \`0\`, and every \`rounded-*\` utility (\`rounded-sm\` to \`rounded-4xl\`) is derived from it, so components written with the radius scale come out square. Use the scale classes, never a hard-coded radius such as \`rounded-[12px]\`, so a theme can change the radius in one place. \`rounded-full\` stays round and is for avatars, status dots, and switches.

## Components

- Build from the existing Cortexcn and shadcn components before writing new ones. Keep their \`data-slot\` attributes; styles and tests rely on them.
- Compose classes with \`cn()\` and add variants with \`class-variance-authority\`, the way \`Button\` does.
- Buttons: \`default\` (primary), \`outline\`, \`secondary\`, \`ghost\`, \`destructive\` (a tinted fill, not solid red), and \`link\`. One primary action per view.
- Inputs: a one-pixel \`border-input\`, transparent fill, and a visible focus ring.
- Focus: every interactive element shows \`focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50\`. Never remove the outline without that replacement.
- Motion: 100 to 300 ms, easing out, on \`transform\` and \`opacity\` where possible. Respect \`prefers-reduced-motion\` by turning motion off or shortening it.
- Icons are 16px (\`size-4\`) in controls and inherit \`currentColor\`.

## Do's and Don'ts

Do:

- Use the token classes for every color and the radius scale for every corner.
- Check light and dark mode, keyboard focus, and reduced motion before you finish.
- Keep one primary action per view and let the rest be \`outline\` or \`ghost\`.
- Separate surfaces with \`border-border\` and \`bg-card\` before reaching for a shadow.

Don't:

- Don't write hex, rgb, or oklch values in components, or add per-component dark colors.
- Don't round corners by hand or mix rounded and square elements.
- Don't use color alone to carry meaning; pair it with text or an icon.
- Don't animate layout properties such as width and height when a transform does the job.
`;
}

/**
 * The pre-commit hook runs Prettier on markdown and JSON, so format the output
 * the same way here; otherwise the registry JSON built from it goes stale on
 * commit.
 */
function formatWithPrettier(file) {
  const prettier = join(uiRoot, "../../node_modules/prettier/bin/prettier.cjs");
  const result = spawnSync(process.execPath, [prettier, "--write", file], {
    stdio: "ignore",
  });
  if (result.status !== 0) {
    throw new Error(`Prettier could not format ${file}.`);
  }
}

async function buildDesignMd() {
  const css = await readFile(tokensPath, "utf8");
  const tailwind = await readFile(tailwindThemePath, "utf8");
  const palette = readBlock(tailwind, "@theme default");
  const lightRaw = readBlock(css, ":root");
  const darkRaw = readBlock(css, ".dark");
  const light = new Map(
    [...lightRaw].map(([name, value]) => [
      name,
      resolve(value, [lightRaw, palette]),
    ]),
  );
  const dark = new Map(
    [...darkRaw].map(([name, value]) => [
      name,
      resolve(value, [darkRaw, lightRaw, palette]),
    ]),
  );
  const missing = COLOR_ROLES.map(([name]) => name).filter(
    (name) => !light.has(name),
  );
  if (missing.length > 0) {
    throw new Error(`Tokens missing from ${tokensPath}: ${missing.join(", ")}`);
  }
  const output = `${frontMatter(light, dark)}\n${body(light, dark)}`;
  const designPath = join(agentsDir, "DESIGN.md");
  await writeFile(designPath, output);
  formatWithPrettier(designPath);
  return output.length;
}

async function publishSkills() {
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skills = [];
  for (const entry of entries.filter((item) => item.isDirectory())) {
    const source = join(skillsDir, entry.name, "SKILL.md");
    const text = await readFile(source, "utf8");
    const description = DESCRIPTION_LINE.exec(
      FRONTMATTER.exec(text)?.[1] ?? "",
    )?.[1]?.trim();
    if (!description) {
      throw new Error(`${source} needs a description in its front matter.`);
    }
    await mkdir(join(wellKnownDir, entry.name), { recursive: true });
    await copyFile(source, join(wellKnownDir, entry.name, "SKILL.md"));
    skills.push({ name: entry.name, description, files: ["SKILL.md"] });
  }
  skills.sort((a, b) => a.name.localeCompare(b.name));
  const indexPath = join(wellKnownDir, "index.json");
  await writeFile(indexPath, `${JSON.stringify({ skills }, null, 2)}\n`);
  formatWithPrettier(indexPath);
  return skills.map((skill) => skill.name);
}

const size = await buildDesignMd();
const skills = await publishSkills();
console.log(
  `DESIGN.md: ${size} characters. Skills published: ${skills.join(", ")}.`,
);
