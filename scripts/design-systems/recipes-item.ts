/**
 * Keeps the `design-system-recipes` registry item in step with
 * packages/ui/src/styles/cortexcn-recipes.css: its cssVars and @utility
 * rules, and the registryDependencies of every component that uses them.
 * `bun run ds:build` writes it; `bun run validate:ds` checks it.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const UI = resolve(import.meta.dirname, "../../packages/ui");
const CSS_PATH = join(UI, "src/styles/cortexcn-recipes.css");
const REGISTRY_PATH = join(UI, "registry.json");
const COMPONENTS = join(UI, "src/components");
export const ITEM_NAME = "design-system-recipes";
const DEPENDENCY = `@cortexcn/${ITEM_NAME}`;

const COMMENT = /\/\*[\s\S]*?\*\//g;
const SPACES = /\s+/g;
const THEME_BLOCK = /@theme inline \{([\s\S]*?)\n\}/;
const UTILITY_BLOCK = /@utility ([a-z0-9-]+) \{([\s\S]*?)\n\}/g;
const ESCAPE = /[.*+?^${}()|[\]\\]/g;
const LEADING_DASHES = /^--/;
const OPEN_PAREN_SPACE = /\(\s+/g;
const CLOSE_PAREN_SPACE = /\s+\)/g;
const THEME_KEY =
  /^(radius|spacing|color|shadow|font-weight|drop-shadow)-(.+)$/;

interface RegistryItem {
  name: string;
  type: string;
  files?: { path: string }[];
  registryDependencies?: string[];
  [key: string]: unknown;
}

/** Splits `a: b; c: d(e; f);` at top-level semicolons. */
function declarations(body: string): [string, string][] {
  const result: [string, string][] = [];
  let depth = 0;
  let current = "";
  for (const char of body) {
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    }
    if (char === ";" && depth === 0) {
      const index = current.indexOf(":");
      result.push([
        current.slice(0, index).trim(),
        current
          .slice(index + 1)
          .replace(SPACES, " ")
          .trim(),
      ]);
      current = "";
      continue;
    }
    current += char;
  }
  return result;
}

function parseRecipes() {
  const css = readFileSync(CSS_PATH, "utf8").replace(COMMENT, "");
  const theme = Object.fromEntries(
    declarations(css.match(THEME_BLOCK)?.[1] ?? "").map(([name, value]) => [
      name.replace(LEADING_DASHES, ""),
      value.replace(OPEN_PAREN_SPACE, "(").replace(CLOSE_PAREN_SPACE, ")"),
    ]),
  );
  const utilities: Record<string, Record<string, string>> = {};
  for (const match of css.matchAll(UTILITY_BLOCK)) {
    utilities[`@utility ${match[1]}`] = Object.fromEntries(
      declarations(match[2] ?? ""),
    );
  }
  return { theme, utilities };
}

/** Class-name patterns for every theme key and utility in the file. */
function usagePattern(theme: Record<string, string>, utilities: string[]) {
  const names: string[] = [];
  for (const key of Object.keys(theme)) {
    const [, group, name] = key.match(THEME_KEY) ?? [];
    if (!(group && name)) {
      continue;
    }
    const escaped = name.replace(ESCAPE, "\\$&");
    const prefix = {
      radius: "rounded(?:-[trbl]{1,2})?",
      spacing: "(?:h|w|size|min-h|min-w|max-h|max-w|p|px|py|pt|pb|pl|pr|gap)",
      color: "(?:bg|text|fill|stroke|border|ring|via|from|to|outline|shadow)",
      shadow: "shadow",
      "font-weight": "font",
      "drop-shadow": "drop-shadow",
    }[group];
    names.push(`${prefix}-${escaped}`);
  }
  for (const utility of utilities) {
    names.push(utility.replace("@utility ", "").replace(ESCAPE, "\\$&"));
  }
  return new RegExp(`(?<![\\w-])(?:${names.join("|")})(?![\\w-])`);
}

/** The registry with the recipes item and dependencies brought up to date. */
export function syncedRegistry() {
  const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8")) as {
    items: RegistryItem[];
  };
  const { theme, utilities } = parseRecipes();
  const item: RegistryItem = {
    name: ITEM_NAME,
    type: "registry:item",
    title: "Design system recipes",
    description:
      "Theme utilities (rounded-button, h-input, shadow-menu, and more) that let a DESIGN.md design system restyle Cortexcn components. Each one falls back to the component's own default.",
    cssVars: { theme },
    css: utilities,
  };
  const items = registry.items.filter((entry) => entry.name !== ITEM_NAME);
  const after = items.findIndex((entry) => entry.name === "utils");
  items.splice(after + 1, 0, item);

  const pattern = usagePattern(theme, Object.keys(utilities));
  const usesRecipes = new Set(
    readdirSync(COMPONENTS)
      .filter((file) => file.endsWith(".tsx"))
      .filter((file) =>
        pattern.test(readFileSync(join(COMPONENTS, file), "utf8")),
      )
      .map((file) => `src/components/${file}`),
  );
  for (const entry of items) {
    const uses = (entry.files ?? []).some((file) => usesRecipes.has(file.path));
    const deps = (entry.registryDependencies ?? []).filter(
      (dep) => dep !== DEPENDENCY,
    );
    if (uses) {
      deps.push(DEPENDENCY);
    }
    if (deps.length > 0 || entry.registryDependencies) {
      entry.registryDependencies = deps;
    }
  }
  return `${JSON.stringify({ ...registry, items }, null, 2)}\n`;
}

export function registryInSync() {
  return readFileSync(REGISTRY_PATH, "utf8") === syncedRegistry();
}

export function writeRegistry() {
  writeFileSync(REGISTRY_PATH, syncedRegistry());
}
