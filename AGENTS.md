# Agent guide (Cortexcn contributors)

Cortexcn is a Bun and Turborepo workspace for a shadcn registry of React components, page blocks, and charts. `apps/web` is the docs site and registry host (`ui.cortexcn.dev`, and `www.cortexcn.dev` from the same deployment); `packages/ui` (`@cortexcn/ui`) holds the source that the registry ships. Setup and scripts are in [README.md](./README.md).

Repo workflows live as Agent Skills in `.agents/skills/`. Read the relevant skill before acting, and do not guess at file layout. `apps/web/AGENTS.md` has notes on the Next.js version this site uses.

## Where things live

| Area                          | Path                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| Chart primitives and exports  | `packages/ui/src/charts/` (public exports in `index.ts`)                             |
| Components                    | `packages/ui/src/components/`                                                        |
| Registry source               | `packages/ui/registry.json`                                                          |
| Registry build output         | `apps/web/public/r/` (written by `bun run registry:build`, do not edit by hand)      |
| Block sources                 | `apps/web/blocks/` (copied into `packages/ui/registry/blocks` by the registry build) |
| Docs pages                    | `apps/web/content/docs/` (MDX, Fumadocs)                                             |
| Docs sidebar                  | `apps/web/content/docs/components/meta.json`                                         |
| Mobile docs nav               | `apps/web/components/docs/site-header.tsx`                                           |
| Chart gallery (`/charts/...`) | `apps/web/components/charts/chart-slugs.ts` and `chart-examples.tsx`                 |
| MCP server                    | `apps/web/app/mcp/route.ts` and `apps/web/lib/mcp/`                                  |
| Agent skills shipped to users | `packages/ui/src/agents/skills/`                                                     |
| Host routing (ui vs www)      | `apps/web/lib/site-url.ts` and `apps/web/proxy.ts`                                   |

## Adding or changing a chart or component

1. Put the source in `packages/ui`. Export charts from `packages/ui/src/charts/index.ts`, and add an `exports` entry in `packages/ui/package.json` if the site imports it from a new path.
2. Add or update the item in `packages/ui/registry.json` when it should install with the shadcn CLI. Registry dependencies use the `@cortexcn/<item>` namespace.
3. Docs:
   - A new component or chart kind gets `apps/web/content/docs/components/<name>.mdx` (frontmatter, `<ComponentPreview>`, installation, usage, props), an entry in `meta.json`, and an entry in `site-header.tsx`.
   - When you extend an existing chart, add the new props to the parent page's tables and to the related utility pages (`content/docs/utility/*.mdx`). Keep the main preview on an existing page as it is.
   - MDX files import live previews from the workspace package (`@cortexcn/ui/...`). Code samples shown to readers import from where the registry installs the files, for example `from "@/components/charts"`.
4. Gallery: for a new chart kind, add its slug to `chart-slugs.ts` and its examples to `chart-examples.tsx`.
5. From this folder, run `bun run registry:build` and commit the changes it makes under `apps/web/public/r/`.
6. Run `bun run lint`, `bun run --filter @cortexcn/ui test` when package logic changed, and `bun run build` until they pass. Keep the `run`: `bun build` and `bun test` are Bun's own bundler and test runner, not these scripts.

## Contributor skills

| Skill            | When                                                                      |
| ---------------- | ------------------------------------------------------------------------- |
| `pr-open`        | Commit, run the checks, push, and open a PR (Cortexcn checklist)          |
| `unit-tests`     | Adding tests without over-testing                                         |
| `turborepo`      | Monorepo tasks, `turbo.json`, caching                                     |
| `shadcn`         | shadcn/ui components and the shadcn CLI                                   |
| `wiki-llms-text` | Regenerating `llms.txt` and `wiki/` with `node scripts/generate-llms.mjs` |
