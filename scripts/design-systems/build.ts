/**
 * Regenerates every design-systems/<id>/theme.css from its tokens.json
 * (`bun run ds:build`). Run it after editing a tokens.json by hand.
 */
import { writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { themeCss } from "../../design-systems/_schema/css";
import { loadSystems } from "../../design-systems/_schema/load";
import { formatFiles } from "./format";
import { writeRegistry } from "./recipes-item";

const ROOT = resolve(import.meta.dirname, "../../design-systems");

const written: string[] = [];
for (const { id, dir, tokens, meta } of loadSystems(ROOT)) {
  const path = join(dir, "theme.css");
  writeFileSync(
    path,
    themeCss(tokens, { name: meta.name, disclaimer: meta.source.disclaimer }),
  );
  written.push(path);
  console.log(`theme.css ${id}`);
}
formatFiles(written);

// The registry item that ships the recipe utilities to installs.
writeRegistry();
console.log("packages/ui/registry.json design-system-recipes");
