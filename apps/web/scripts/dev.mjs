/**
 * `bun run dev`: one Next.js dev server, reachable on three ports so each site
 * can stay open in its own tab (ports in dev-ports.json):
 *
 *   site        the services site (www.cortexcn.dev)
 *   library     the component library home (ui.cortexcn.dev)
 *   components  the components docs on the library
 *
 * Next.js listens on the site port. The other two ports forward raw TCP to
 * it, so pages, assets, and hot reload all pass through unchanged, and
 * proxy.ts picks the library from the port in the Host header.
 *
 * When .env names a Convex deployment (CONVEX_DEPLOYMENT), it also runs
 * `convex dev` to keep the functions in convex/ synced. The Convex values go
 * to the CLI through the environment, so it never writes a .env.local; every
 * setting stays in .env. Without a deployment, sign-in simply stays off.
 *
 * Usage: node scripts/dev.mjs [--webpack]
 */
import { spawn } from "node:child_process";
import {
  existsSync,
  readFileSync,
  rmSync,
  watch,
  writeFileSync,
} from "node:fs";
import { connect, createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const ports = JSON.parse(readFileSync(join(webRoot, "dev-ports.json"), "utf8"));
const useWebpack = process.argv.includes("--webpack");

function forward(fromPort, toPort) {
  const server = createServer((client) => {
    const upstream = connect(toPort, "127.0.0.1");
    client.pipe(upstream).pipe(client);
    const close = () => {
      client.destroy();
      upstream.destroy();
    };
    client.on("error", close);
    upstream.on("error", close);
  });
  server.on("error", (error) => {
    console.error(`Port ${fromPort} is not free: ${error.message}`);
  });
  server.listen(fromPort);
  return server;
}

const servers = [
  forward(ports.library, ports.site),
  forward(ports.components, ports.site),
];

const next = spawn(
  process.execPath,
  [
    join(webRoot, "node_modules/next/dist/bin/next"),
    "dev",
    ...(useWebpack ? [] : ["--turbopack"]),
    "--port",
    String(ports.site),
  ],
  {
    cwd: webRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_OPTIONS: [process.env.NODE_OPTIONS, "--max-old-space-size=16384"]
        .filter(Boolean)
        .join(" "),
    },
  },
);

const LINE_BREAK_RE = /\r?\n/;
const ENV_LINE_RE = /^([A-Z0-9_]+)=(.*)$/;
const INLINE_COMMENT_RE = /\s+#.*$/;
const QUOTED_RE = /^(["'])(.*)\1$/;

/** KEY=value lines from .env; unquoted values drop a trailing "# comment". */
function readEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }
  const entries = readFileSync(path, "utf8")
    .split(LINE_BREAK_RE)
    .map((line) => line.match(ENV_LINE_RE))
    .filter(Boolean)
    .map(([, key, value]) => [
      key,
      value.replace(INLINE_COMMENT_RE, "").trim().replace(QUOTED_RE, "$2"),
    ]);
  return Object.fromEntries(entries);
}

const envPath = join(webRoot, ".env");
const envLocalPath = join(webRoot, ".env.local");

/**
 * The Convex CLI always writes .env.local for Next.js projects. Fold anything
 * new from it into .env and delete it, so .env stays the only env file.
 */
function absorbEnvLocal() {
  if (!(existsSync(envLocalPath) && existsSync(envPath))) {
    return;
  }
  const local = readEnvFile(envLocalPath);
  const current = readEnvFile(envPath);
  let text = readFileSync(envPath, "utf8");
  let changed = false;
  for (const [key, value] of Object.entries(local)) {
    if (current[key] === value) {
      continue;
    }
    const line = new RegExp(`^${key}=.*$`, "m");
    text = line.test(text)
      ? text.replace(line, `${key}=${value}`)
      : `${text.trimEnd()}\n${key}=${value}\n`;
    changed = true;
  }
  if (changed) {
    writeFileSync(envPath, text);
  }
  rmSync(envLocalPath, { force: true });
}

absorbEnvLocal();
const env = readEnvFile(envPath);
const hasConvex = Boolean(env.CONVEX_DEPLOYMENT);
const convex = hasConvex
  ? spawn(
      process.execPath,
      [join(webRoot, "node_modules/convex/bin/main.js"), "dev"],
      {
        cwd: webRoot,
        stdio: "inherit",
        env: {
          ...process.env,
          CONVEX_DEPLOYMENT: env.CONVEX_DEPLOYMENT,
          NEXT_PUBLIC_CONVEX_URL: env.NEXT_PUBLIC_CONVEX_URL,
          NEXT_PUBLIC_CONVEX_SITE_URL: env.NEXT_PUBLIC_CONVEX_SITE_URL,
        },
      },
    )
  : null;

// The CLI writes .env.local as it starts; sweep it back into .env each time.
const envWatcher = hasConvex
  ? watch(webRoot, (_event, filename) => {
      if (filename === ".env.local") {
        setTimeout(absorbEnvLocal, 200);
      }
    })
  : null;

console.log(
  [
    "",
    `  Site        http://localhost:${ports.site}`,
    `  Library     http://localhost:${ports.library}`,
    `  Components  http://localhost:${ports.components}`,
    `  Convex      ${hasConvex ? "syncing convex/" : "not set up (sign-in off)"}`,
    "",
  ].join("\n"),
);

function stop() {
  for (const server of servers) {
    server.close();
  }
  next.kill();
  convex?.kill();
  envWatcher?.close();
  absorbEnvLocal();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
next.on("exit", (code) => {
  for (const server of servers) {
    server.close();
  }
  convex?.kill();
  envWatcher?.close();
  absorbEnvLocal();
  process.exit(code ?? 0);
});
