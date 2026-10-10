/**
 * Reads systems from disk. The validator, the build script, and the MCP
 * server all go through here, so `design-systems/` stays the one source.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type DesignMeta, metaSchema } from "./meta";
import { type DesignTokens, tokensSchema } from "./tokens";

export const SYSTEM_FILES = [
  "DESIGN.md",
  "tokens.json",
  "theme.css",
  "meta.json",
] as const;

export type SystemFile = (typeof SYSTEM_FILES)[number];

export interface LoadedSystem {
  id: string;
  dir: string;
  tokens: DesignTokens;
  meta: DesignMeta;
}

/** Folder names of every system, skipping `_schema` and other `_` folders. */
export function listSystemIds(root: string): string[] {
  return readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("_") &&
        !entry.name.startsWith(".") &&
        existsSync(join(root, entry.name, "tokens.json")),
    )
    .map((entry) => entry.name)
    .sort();
}

export function readSystemFile(root: string, id: string, file: SystemFile) {
  return readFileSync(join(root, id, file), "utf8");
}

/** Parses and validates one system; throws with every problem listed. */
export function loadSystem(root: string, id: string): LoadedSystem {
  const tokens = tokensSchema.parse(
    JSON.parse(readSystemFile(root, id, "tokens.json")),
  );
  const meta = metaSchema.parse(
    JSON.parse(readSystemFile(root, id, "meta.json")),
  );
  return { id, dir: join(root, id), tokens, meta };
}

export function loadSystems(root: string): LoadedSystem[] {
  return listSystemIds(root).map((id) => loadSystem(root, id));
}
