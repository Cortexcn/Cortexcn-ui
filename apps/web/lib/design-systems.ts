import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The DESIGN.md design systems in design-systems/ at the repo root, read at
 * build time for the /design-systems showcase.
 */
const ROOT = join(process.cwd(), "../../design-systems");

type Role = "display" | "body" | "mono";

export interface ShowcaseSystem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sourceMode: "light" | "dark" | "both";
  sourceUrl: string;
  disclaimer: string;
  fonts: { role: Role; referenced: string; fallback: string }[];
  stacks: Record<Role, string>;
  scale: number[];
  gaps: Record<string, number>;
  contrast: {
    path: string;
    against: string;
    ratio: number;
    suggested: string;
  }[];
}

interface Meta {
  id: string;
  name: string;
  description: string;
  tags: string[];
  sourceMode: ShowcaseSystem["sourceMode"];
  source: { url: string; disclaimer: string };
  fonts: ShowcaseSystem["fonts"];
  gaps: {
    path: string;
    kind: string;
    against?: string;
    ratio?: number;
    suggested?: string;
  }[];
}

interface Tokens {
  typography: Record<Role, { stack: string }> & { scale: number[] };
}

function systemIds() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();
}

function read<T>(id: string, file: string): T {
  return JSON.parse(readFileSync(join(ROOT, id, file), "utf8")) as T;
}

export function getShowcaseSystems(): ShowcaseSystem[] {
  return systemIds().map((id) => {
    const meta = read<Meta>(id, "meta.json");
    const tokens = read<Tokens>(id, "tokens.json");
    const gaps: Record<string, number> = {};
    for (const gap of meta.gaps) {
      gaps[gap.kind] = (gaps[gap.kind] ?? 0) + 1;
    }
    return {
      id,
      name: meta.name,
      description: meta.description,
      tags: meta.tags,
      sourceMode: meta.sourceMode,
      sourceUrl: meta.source.url,
      disclaimer: meta.source.disclaimer,
      fonts: meta.fonts.map(({ role, referenced, fallback }) => ({
        role,
        referenced,
        fallback,
      })),
      stacks: {
        display: tokens.typography.display.stack,
        body: tokens.typography.body.stack,
        mono: tokens.typography.mono.stack,
      },
      scale: tokens.typography.scale,
      gaps,
      contrast: meta.gaps
        .filter((gap) => gap.kind === "contrast")
        .map((gap) => ({
          path: gap.path,
          against: gap.against ?? "",
          ratio: gap.ratio ?? 0,
          suggested: gap.suggested ?? "",
        })),
    };
  });
}

/** Every system's theme.css, one after another. */
export function getThemesCss() {
  return systemIds()
    .map((id) => readFileSync(join(ROOT, id, "theme.css"), "utf8"))
    .join("\n");
}
