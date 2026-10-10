#!/usr/bin/env node
/**
 * design-md-mcp: a stdio MCP server for the DESIGN.md design systems in
 * design-systems/. It reads them straight from that folder; pass --dir or
 * set DESIGN_SYSTEMS_DIR to point it somewhere else.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server";

function systemsRoot() {
  const flag = process.argv.indexOf("--dir");
  const fromFlag = flag === -1 ? undefined : process.argv[flag + 1];
  if (fromFlag) {
    return resolve(fromFlag);
  }
  if (process.env.DESIGN_SYSTEMS_DIR) {
    return resolve(process.env.DESIGN_SYSTEMS_DIR);
  }
  // src/index.ts and dist/index.js both sit two levels below the package.
  return resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../../../design-systems",
  );
}

const root = systemsRoot();
serveStdio(() => createServer(root), {
  onerror: (error) => console.error(`design-md-mcp: ${error.message}`),
});
