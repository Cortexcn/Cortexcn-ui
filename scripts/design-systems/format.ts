import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Formats generated files with the repo's Biome, so lint stays clean. */
export function formatFiles(paths: string[]) {
  if (paths.length === 0) {
    return;
  }
  const biome = require.resolve("@biomejs/biome/bin/biome");
  execFileSync(process.execPath, [biome, "format", "--write", ...paths], {
    stdio: "ignore",
  });
}
