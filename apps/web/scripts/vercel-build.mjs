/**
 * Vercel's build command (see vercel.json), run from the repository root.
 *
 * With CONVEX_DEPLOY_KEY set (production only), it deploys the functions in
 * apps/web/convex and builds the site against that deployment: `convex deploy`
 * passes the deployment URL to the build as NEXT_PUBLIC_CONVEX_URL. Without a
 * key, such as on preview deployments, it only builds the site and sign-in
 * stays off.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(webRoot, "../..");
const SITE_BUILD = "bunx turbo run build --filter=web";

function run(command, cwd) {
  const result = spawnSync(command, { cwd, shell: true, stdio: "inherit" });
  process.exit(result.status ?? 1);
}

if (process.env.CONVEX_DEPLOY_KEY) {
  run(
    `bunx convex deploy --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL --cmd "cd ../.. && ${SITE_BUILD}"`,
    webRoot,
  );
} else {
  console.log("No CONVEX_DEPLOY_KEY: building the site without Convex.");
  run(SITE_BUILD, repoRoot);
}
