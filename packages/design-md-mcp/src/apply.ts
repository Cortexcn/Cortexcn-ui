/**
 * apply_design_system: works out the file changes that make a project
 * render in a design system, as unified diffs, and writes them on request.
 *
 * - Tailwind v4: appends the theme (:root, .dark, and an @theme inline
 *   mapping) to the global CSS between marker comments, so re-running
 *   replaces it.
 * - Tailwind v3: appends the CSS variables the same way, adds a preset file,
 *   and registers it in tailwind.config.
 * - Fonts: next/font in Next.js projects (a fonts module plus the class on
 *   <html>), a Google Fonts @import otherwise.
 * - DESIGN.md: copied to the project root for agents to read.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, posix, resolve } from "node:path";
import {
  rootThemeCss,
  tailwindV3Preset,
  tailwindV4Theme,
} from "../../../design-systems/_schema/css";
import type { LoadedSystem } from "../../../design-systems/_schema/load";
import type { DesignTokens } from "../../../design-systems/_schema/tokens";
import { unifiedDiff } from "./diff";

export interface FileChange {
  path: string;
  created: boolean;
  diff: string;
  after: string;
}

export interface ApplyPlan {
  projectPath: string;
  tailwind: 3 | 4;
  framework: "next" | "other";
  globalCss: string;
  changes: FileChange[];
  notes: string[];
}

const MARK_START = "/* design-md-mcp:start";
const MARK_END = "/* design-md-mcp:end */";
const MARKED_BLOCK =
  /\n*\/\* design-md-mcp:start[\s\S]*?\/\* design-md-mcp:end \*\/\n?/;
const VERSION = /(\d+)/;
const SPACE = / /g;
const IMPORT_LINE = /^import .*;$/gm;
const HTML_TAG = /<html(\s[^>]*)?>/;
const CLASS_LITERAL = /className="([^"]*)"/;
const CLASS_TEMPLATE = /className=\{`([^`]*)`\}/;
const DASH_LETTER = /-([a-z0-9])/g;
const CONFIG_OBJECT =
  /(module\.exports\s*=\s*\{|export default\s*\{|const config(?::\s*Config)?\s*=\s*\{)/;
const DESIGN_SOURCE = /Source: https:\/\/getdesign\.md\//;
const QUOTED_FAMILY = /^"[^"]+",\s*/;

const GLOBAL_CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "styles/globals.css",
  "src/styles/globals.css",
  "app/global.css",
  "src/index.css",
  "src/styles.css",
];
const LAYOUTS = [
  "app/layout.tsx",
  "src/app/layout.tsx",
  "app/layout.jsx",
  "src/app/layout.jsx",
];
const TAILWIND_CONFIGS = [
  "tailwind.config.ts",
  "tailwind.config.js",
  "tailwind.config.mjs",
  "tailwind.config.cjs",
];

/** Google Fonts families that are not variable fonts, with the weights to load. */
const STATIC_WEIGHTS: Record<string, string[]> = {
  "Bebas Neue": ["400"],
  "Instrument Serif": ["400"],
  "IBM Plex Mono": ["400", "500", "600"],
  "Ubuntu Mono": ["400", "700"],
  "DM Mono": ["400", "500"],
};

const ROLES = ["display", "body", "mono"] as const;

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function readText(path: string) {
  return existsSync(path)
    ? readFileSync(path, "utf8").replaceAll("\r\n", "\n")
    : null;
}

function firstExisting(root: string, candidates: string[]) {
  return candidates.find((candidate) => existsSync(join(root, candidate)));
}

function detect(root: string) {
  const pkgText = readText(join(root, "package.json"));
  if (pkgText === null) {
    throw new Error(`No package.json in ${root}`);
  }
  const pkg = JSON.parse(pkgText) as PackageJson;
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const major = Number(deps.tailwindcss?.match(VERSION)?.[1] ?? Number.NaN);
  let tailwind: 3 | 4;
  if (major >= 4 || deps["@tailwindcss/postcss"] || deps["@tailwindcss/vite"]) {
    tailwind = 4;
  } else if (major === 3 || firstExisting(root, TAILWIND_CONFIGS)) {
    tailwind = 3;
  } else {
    throw new Error(
      "No Tailwind CSS found (no tailwindcss dependency or config)",
    );
  }

  let globalCss = firstExisting(root, GLOBAL_CSS_CANDIDATES);
  const shadcn = readText(join(root, "components.json"));
  if (shadcn) {
    const css = (JSON.parse(shadcn) as { tailwind?: { css?: string } }).tailwind
      ?.css;
    if (css && existsSync(join(root, css))) {
      globalCss = css;
    }
  }
  if (!globalCss) {
    throw new Error(
      `No global stylesheet found; looked for ${GLOBAL_CSS_CANDIDATES.join(", ")}`,
    );
  }
  return {
    tailwind,
    globalCss,
    next: Boolean(deps.next),
    layout: firstExisting(root, LAYOUTS),
    config: firstExisting(root, TAILWIND_CONFIGS),
  };
}

const slug = (family: string) => family.toLowerCase().replace(SPACE, "-");
const fontVariable = (family: string) => `--font-ds-${slug(family)}`;
const identifier = (family: string) => family.replace(SPACE, "_");
const camel = (family: string) =>
  slug(family).replace(DASH_LETTER, (_, letter: string) =>
    letter.toUpperCase(),
  );

function families(tokens: DesignTokens) {
  return [...new Set(ROLES.map((role) => tokens.typography[role].fallback))];
}

/** A next/font module that loads the system's fallback families. */
function nextFontsModule(system: LoadedSystem) {
  const list = families(system.tokens);
  const declarations = list.map((family) => {
    const weight = STATIC_WEIGHTS[family];
    return [
      `const ${camel(family)} = ${identifier(family)}({`,
      `  subsets: ["latin"],`,
      ...(weight ? [`  weight: ${JSON.stringify(weight)},`] : []),
      `  variable: "${fontVariable(family)}",`,
      "});",
    ].join("\n");
  });
  return [
    `// Fonts for the ${system.meta.name} design system, written by design-md-mcp.`,
    "// Open-licensed stand-ins for the DESIGN.md's fonts; see DESIGN.md.",
    `import { ${list.map(identifier).sort().join(", ")} } from "next/font/google";`,
    "",
    ...declarations.flatMap((declaration) => [declaration, ""]),
    "/** Put on <html> so the --font-ds-* variables reach the whole page. */",
    `export const designSystemFonts = [${list.map((family) => `${camel(family)}.variable`).join(", ")}].join(" ");`,
    "",
  ].join("\n");
}

function googleFontsImport(tokens: DesignTokens) {
  const query = families(tokens)
    .map((family) => {
      const weights = STATIC_WEIGHTS[family] ?? [
        "300",
        "400",
        "500",
        "600",
        "700",
      ];
      return `family=${family.replace(SPACE, "+")}:wght@${weights.join(";")}`;
    })
    .join("&");
  return `@import url("https://fonts.googleapis.com/css2?${query}&display=swap");`;
}

/** Tokens whose font stacks start with the next/font variables. */
function withFontVariables(tokens: DesignTokens): DesignTokens {
  const typography = { ...tokens.typography };
  for (const role of ROLES) {
    const font = typography[role];
    typography[role] = {
      ...font,
      stack: `var(${fontVariable(font.fallback)}), ${font.stack.replace(QUOTED_FAMILY, "")}`,
    };
  }
  return { ...tokens, typography };
}

function themeBlock(system: LoadedSystem, tokens: DesignTokens, v4: boolean) {
  const options = {
    name: system.meta.name,
    disclaimer: system.meta.source.disclaimer,
  };
  return [
    `${MARK_START} ${system.id}. Written by apply_design_system; run it again to replace this block. */`,
    rootThemeCss(tokens, options).trimEnd(),
    ...(v4 ? ["", tailwindV4Theme()] : []),
    "",
    "body {",
    "  background-color: var(--background);",
    "  color: var(--foreground);",
    "  font-family: var(--ds-font-body);",
    "  letter-spacing: var(--ds-tracking-body);",
    "}",
    MARK_END,
    "",
  ].join("\n");
}

function patchLayout(layout: string): string | null {
  if (layout.includes("designSystemFonts")) {
    return layout;
  }
  const imports = [...layout.matchAll(IMPORT_LINE)];
  const lastImport = imports.at(-1);
  const html = layout.match(HTML_TAG);
  if (!(lastImport && html)) {
    return null;
  }
  const attributes = html[1] ?? "";
  let tag: string;
  if (!attributes.includes("className")) {
    tag = `<html className={designSystemFonts}${attributes}>`;
  } else if (CLASS_TEMPLATE.test(attributes)) {
    const replaced = attributes.replace(
      CLASS_TEMPLATE,
      (_, classes: string) =>
        `className={\`${classes} \${designSystemFonts}\`}`,
    );
    tag = `<html${replaced}>`;
  } else if (CLASS_LITERAL.test(attributes)) {
    tag = `<html${attributes.replace(CLASS_LITERAL, (_, classes: string) => `className={\`${classes} \${designSystemFonts}\`}`)}>`;
  } else {
    return null;
  }
  const insertAt = (lastImport.index ?? 0) + lastImport[0].length;
  const withImport = `${layout.slice(0, insertAt)}\nimport { designSystemFonts } from "./design-system-fonts";${layout.slice(insertAt)}`;
  return withImport.replace(HTML_TAG, tag);
}

function patchTailwindConfig(config: string, file: string): string | null {
  if (config.includes("tailwind.design-system")) {
    return config;
  }
  if (!CONFIG_OBJECT.test(config)) {
    return null;
  }
  const commonjs = config.includes("module.exports");
  const presetLine = commonjs
    ? '  presets: [require("./tailwind.design-system.cjs")],'
    : "  presets: [designSystem],";
  const body = config.replace(
    CONFIG_OBJECT,
    (match) => `${match}\n${presetLine}`,
  );
  return commonjs || file.endsWith(".cjs")
    ? body
    : `import designSystem from "./tailwind.design-system.cjs";\n${body}`;
}

/** Works out every change; writes nothing. */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: fonts, theme CSS, the v3 preset, and DESIGN.md each have a fallback path, kept in one readable pass
export function planApply(
  system: LoadedSystem,
  designMd: string,
  projectPath: string,
): ApplyPlan {
  const root = resolve(projectPath);
  const found = detect(root);
  const v4 = found.tailwind === 4;
  const notes: string[] = [];
  const changes: FileChange[] = [];
  const change = (path: string, after: string) => {
    const before = readText(join(root, path));
    if (before === after) {
      return;
    }
    changes.push({
      path,
      created: before === null,
      after,
      diff: unifiedDiff(path, before, after),
    });
  };

  // Fonts
  let tokens = system.tokens;
  let fontImport: string | null = null;
  const layoutText = found.layout ? readText(join(root, found.layout)) : null;
  const patchedLayout = layoutText === null ? null : patchLayout(layoutText);
  if (found.next && found.layout && patchedLayout) {
    tokens = withFontVariables(tokens);
    change(
      posix.join(posix.dirname(found.layout), "design-system-fonts.ts"),
      nextFontsModule(system),
    );
    change(found.layout, patchedLayout);
  } else {
    fontImport = googleFontsImport(tokens);
    if (found.next) {
      notes.push(
        "Could not find an <html> tag to patch in the root layout, so fonts load with a Google Fonts @import instead of next/font.",
      );
    }
  }

  // Theme CSS
  const css = readText(join(root, found.globalCss)) ?? "";
  let next = css.replace(MARKED_BLOCK, "\n");
  next = `${next.trimEnd()}\n\n${themeBlock(system, tokens, v4)}`;
  const staleImport = next
    .split("\n")
    .find((line) =>
      line.startsWith('@import url("https://fonts.googleapis.com'),
    );
  if (staleImport) {
    next = next.replace(`${staleImport}\n`, "");
  }
  if (fontImport) {
    next = `${fontImport}\n${next}`;
  }
  change(found.globalCss, next);

  // Tailwind v3 preset
  if (!v4) {
    change("tailwind.design-system.cjs", tailwindV3Preset(system.tokens));
    const configText = found.config ? readText(join(root, found.config)) : null;
    const patched =
      found.config && configText !== null
        ? patchTailwindConfig(configText, found.config)
        : null;
    if (found.config && patched) {
      change(found.config, patched);
    } else {
      notes.push(
        'Add `presets: [require("./tailwind.design-system.cjs")]` to your Tailwind config by hand; it could not be patched automatically.',
      );
    }
  }

  // DESIGN.md
  const existing = readText(join(root, "DESIGN.md"));
  if (existing === null || DESIGN_SOURCE.test(existing)) {
    change("DESIGN.md", designMd);
  } else {
    change(`DESIGN.${system.id}.md`, designMd);
    notes.push(
      `The project already has its own DESIGN.md, so the system's copy goes to DESIGN.${system.id}.md.`,
    );
  }

  notes.push(
    "Dark mode follows the .dark class on <html> (the shadcn convention).",
    "Components styled with the shadcn color names (bg-primary, text-muted-foreground, rounded-md, ...) pick the system up with no other changes.",
  );
  return {
    projectPath: root,
    tailwind: found.tailwind,
    framework: found.next ? "next" : "other",
    globalCss: found.globalCss,
    changes,
    notes,
  };
}

export function writePlan(plan: ApplyPlan) {
  for (const change of plan.changes) {
    const path = join(plan.projectPath, change.path);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, change.after);
  }
}
