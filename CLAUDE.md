# CLAUDE.md

Rules for any agent working in this repository. `AGENTS.md` (imported below) has the layout and the base chart and component steps. This file adds how the owner works, the recipes the repo depends on, and the rules that keep a public registry safe. When the two disagree, this file wins. When the user's own words disagree with this file, the user wins for that task.

@AGENTS.md

## Ground rules

- **Bun only.** The package manager is Bun 1.4.0 (`packageManager` in `package.json`). Use `bun install` and `bun run <script>`. Keep the `run`: `bun build` and `bun test` are Bun's own tools, not this repo's scripts. Never add a pnpm, npm, or yarn lockfile.
- **Work on `main`.** No feature branches and no pull requests. The `pr-open` skill's checks still apply; its branch and PR steps don't.
- **Small commits.** About two related files per commit, such as a component and its demo, or two docs pages. Use Conventional Commit messages, as in the history: `feat(blocks): ...`, `fix(registry): ...`, `docs(repo): ...`, `chore(web): ...`.
- **Commit only what you wrote.** Another agent session or the owner may have uncommitted or staged work in this checkout. Stage and commit explicit paths (`git add -- <paths>`, then `git commit -m "..." -- <paths>`). Run `git diff --cached --name-status` before and after each commit, and put back anything of theirs that moved.
- **No attribution trailers.** Commit under the configured git identity only. Never add `Co-Authored-By` or similar lines, even when a tool suggests them.
- **Push only when asked.** A push to `main` deploys production on Vercel, both `ui.cortexcn.dev` and `www.cortexcn.dev`. Before pushing, run `bun run lint` and `bun run build`. If the push is rejected, fetch, then rebase or cherry-pick your commits onto `origin/main`. Never force-push.
- **Never skip hooks.** The pre-commit hook runs `biome check --staged`. If it fails, fix the code and make a new commit.
- **Secrets stay local.** `apps/web/.env` and `.env` hold real keys and are git-ignored. Never print, commit, or paste their values. The `.env.example` files list names only.

## Every shipped change gets a changelog entry

Releases live in `apps/web/lib/changelog.ts`. The `/changelog` page and the latest three on the www landing both read from it, so one entry updates both.

- Add the new release at the **top** of `CHANGELOG`; the list is newest first.
- `date`: the ship date, `YYYY-MM-DD`. Several releases on one day is fine.
- `kind`: `"components"`, `"blocks"`, or `"site"`.
- `title`: what shipped, in sentence case. Follow the existing patterns: "Lanyard Badge, Gooey Nav, and Sphere Menu", "Queue joins the AI Assistant blocks", "Services blocks, starting with Image Grid".
- `summary`: one to three plain sentences about what a visitor sees and can do. Name real behavior, props, and dependencies, with no superlatives.
- `items`: link everything that shipped to its page.
  - For components, use `componentLinks([["Label", "slug"]])`, which links to the slug's page in whichever family holds it, such as `/docs/cortex/<slug>` or `/docs/charts/<slug>`.
  - For blocks, link `/blocks/<category>/<slug>`. A new category also links `/blocks?category=<category>`.

Write the entry in the same change as the work, not later.

## Recipes

### A new Cortex component (a docs page)

It touches six places:

1. `packages/ui/src/components/<name>.tsx`, importing `@/lib/utils`.
2. An item in `packages/ui/registry.json` with `categories: ["cortex"]` and `registryDependencies: ["@cortexcn/utils"]`.
3. A demo in `apps/web/components/docs/<name>-demo.tsx`, importing from `@cortexcn/ui/components/<name>`.
4. `apps/web/content/docs/cortex/<name>.mdx`, with `<ComponentPreview>` and `<InstallationTabs name="<name>" />`.
5. The sidebar, `apps/web/content/docs/cortex/meta.json`, after its `---Cortex---` separator.
6. The `cortexComponents` list in `apps/web/components/docs/site-header.tsx`.

Then add a changelog entry with kind `"components"` and rebuild the registry (see below).

On mobile the docs preview column is only about 212px wide, so check that the demo fits or scrolls there. Keep measured-size 3D and floating transforms client-only, so there are no hydration warnings.

### A new block

1. Create `apps/web/blocks/<category>-<name>-01/`, holding `files/components/<demo>.tsx`, `meta.ts`, `preview.tsx`, and `index.tsx`. In the demo, import components as `@cortexcn/ui/components/<name>`; the generator rewrites that to `@/components/<name>`.
2. Register the block in `apps/web/blocks/manifest.ts`, `previews.ts`, `metas.ts`, and `index.tsx` (`BLOCK_VIEWERS`), and add it to its category in `apps/web/blocks/categories.ts`.
3. Add a `BLOCKS` entry, and a `COMPONENT_EXPORTS` entry if it ships a component, in `packages/ui/scripts/generate-block-registry.mjs`. Showcase blocks such as Loaders have a demo with four examples, the original first. List that demo **first** in `files`, because the v0 example imports the first `components/` file.
4. A block that needs its own component puts it in `packages/ui/src/components/` and adds it to `packages/ui/registry.json`.
5. Add a changelog entry with kind `"blocks"` and rebuild the registry.

**Pasted block code:**

- Use the naming pattern `hero-<name>-01` and `HeroName`.
- Bake the example values in as prop defaults.
- Replace `react-wrap-balancer` with `text-balance`.
- Copy shared helpers, such as `hero-cta.tsx`, into each block that needs one.
- Fix Biome's findings: `interface` over `type`, no array-index keys, and width and height on images.

The routes are:

| Route                       | What it is                                       |
| --------------------------- | ------------------------------------------------ |
| `/blocks`                   | The gallery, with `?category=` and `?q=` filters |
| `/blocks/<category>/<slug>` | One block's page                                 |
| `/blocks/live/<slug>`       | The block full screen                            |
| `/blocks/<category>`        | Redirects to `/blocks?category=<category>`       |

### An AI Assistant block

AI pieces live under Blocks in the `ai-assistant` category, not in the docs. Code handed over as "my code" is often Vercel AI Elements (`https://elements.ai-sdk.dev/api/registry/<name>.json`).

- Give each file the header `// Adapted from AI Elements by Vercel (Apache-2.0, https://elements.ai-sdk.dev).`
- Rewrite `@repo/shadcn-ui/...` imports to local paths.
- Then follow the block recipe.

### Charts

Follow `AGENTS.md`: source in `packages/ui/src/charts/`, the export in `index.ts`, the registry item, the docs page, and the gallery entries in `chart-slugs.ts` and `chart-examples.tsx`.

### After `bun run registry:build`

- Check `git status`. Commit the new `apps/web/public/r/<name>.json` files and the new items in both `registry.json` files.
- If the build rewrote unrelated files with formatting-only changes, restore them with `git checkout HEAD -- <file>`. Committing that churn buries the real change and collides with other sessions.
- Run `bun run registry:verify`. CI runs it too, and fails when `public/r` is out of sync with the source.
- Never edit `apps/web/public/r/` by hand.

### Agent files: DESIGN.md, skills, and the MCP server

**After changing tokens or a skill:**

- The tokens are `packages/ui/src/styles/cortexcn-tokens.css`. The skills are `packages/ui/src/agents/skills/*/SKILL.md`.
- Run `bun run --filter @cortexcn/ui agents:build`. It regenerates `packages/ui/src/agents/DESIGN.md` and copies the skills to `apps/web/public/.well-known/agent-skills/`.
- Then rebuild the registry. The `design-md`, `agent-skills`, and `agent-kit` items ship those files.
- Lint DESIGN.md with `node node_modules/@google/design.md/dist/index.js lint`. On Windows, `npx` prints nothing. Keep it at 0 errors and 0 warnings.

**The MCP server:**

- It is `apps/web/app/mcp/route.ts` and `apps/web/lib/mcp/`.
- It is read-only and reads `public/r` and `content/docs` from disk, so new items show up there with no extra step.
- It answers both the 2025 `initialize` handshake and the 2026 `server/discover`. Keep both working.

### llms.txt

After docs or catalog changes, run `node scripts/generate-llms.mjs` to regenerate `llms.txt` and `wiki/`.

## Licensing

The registry redistributes source code publicly, so every file in it must be ours or under a license that allows that.

- **React Bits** (reactbits.dev) is MIT plus the Commons Clause, which forbids redistributing its components "alone, in a bundle, or as a ported version".
  - Never put React Bits code in the registry, even ported, and even when told it is MIT.
  - Quote its `LICENSE.md` and offer an original rebuild instead, without opening their source.
  - Lanyard 3D, Lanyard Badge, Gooey Nav, and Sphere Menu are originals built this way.
- **Check any pasted code before using it**, including code called "my personal code". Find where it came from and what its license allows first.
- **Framer and other templates:** take layout ideas only. Never copy their text, images, or brand.
- **Credits:**
  - Keep the Apache-2.0 credit headers, for AI Elements and Spectrum UI.
  - Don't add per-file credit comments for MIT sources; that is the owner's call.
  - `LICENSE` keeps "Copyright (c) 2026 uixmat", because the charts came from MIT Bklit UI. Don't remove it.
- **Bklit Studio** was "all rights reserved" and has been deleted. Don't bring back Studio code, links, or wording.
- **Fonts:** Sentient loads from Fontshare's CSS; never commit its font files. Onest comes from `next/font`.

## Design rules

- **Square corners.** `--radius` is `0`. Cortexcn UI isn't rounded, so don't add `rounded-*` classes that bypass the radius tokens.
- **Colors** come from the theme tokens in `cortexcn-tokens.css`.
  - Every change works in light and dark mode.
  - Text meets WCAG AA contrast. `--muted-foreground` and `--destructive` were tuned for that, so recheck if you change them.
- **Accessibility:** every interactive element works from the keyboard, shows a focus ring, and respects `prefers-reduced-motion`.
- **Collapsible:** `apps/web/components/ui/collapsible.tsx` is Base UI.
  - A closed panel is hidden entirely, and state is marked with `data-open` and `data-closed`, not `data-state`. Don't build peek or preview UI on its closed state.
  - The shadcn `collapsible` in `packages/ui` is the Radix version.

## Copy rules

These apply to the site, docs, changelog, READMEs, and commit messages:

- No em dashes.
- No emojis in code, comments, or commit messages.
- Honest claims only. No invented customers, testimonials, logos, or numbers. That is why the template's Client Results and Testimonials sections were left out.
- Say "Cortexcn Blocks", never "Blocks for shadcn/ui"; these are our own blocks.
- Footers read "A product by Cortexcn" and "Building in public at @SyedMoin" (x.com/SyedMoin).
- Write plain, concrete sentences about what the reader sees and does.

## Sites, hosts, and deploys

**Hosts.** One Vercel deployment serves two hosts. The routing lives in `apps/web/lib/site-url.ts` and `apps/web/proxy.ts`.

| Host               | Dev                                                                       | What it serves                                                                           |
| ------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `www.cortexcn.dev` | <http://localhost:4410>                                                   | The services landing: Pricing, FAQ, Contact, and the Services page                       |
| `ui.cortexcn.dev`  | <http://localhost:4420> (home), <http://localhost:4430> (components docs) | The library: its home, docs, blocks, charts, templates, the registry at `/r`, and `/mcp` |

`bun run dev` runs one Next.js server on the site port and forwards the other two ports to it (`apps/web/scripts/dev.mjs`). The ports live in `apps/web/dev-ports.json`, and `http://ui.localhost:4410` still works as the library host.

New library pages go in `apps/web/lib/library-nav-links.ts`, not in the www nav.

**Templates:**

- Free templates live in `templates/<slug>`. Paid ones live in the private `../cortexcn-templates` repo, checked out next to this one.
- Each template is listed in `apps/web/lib/site-templates.ts`.
- Rebuild a preview with `node apps/web/scripts/build-template-preview.mjs <slug>`.
- Checkout isn't wired yet: Buy opens the contact form until `checkoutUrl` is set.

**Vercel:**

- `vercel.json` runs `node apps/web/scripts/vercel-build.mjs` and serves `apps/web/.next`. With `CONVEX_DEPLOY_KEY` set, the script deploys the Convex functions and then runs `turbo run build --filter=web`; without it, it runs only the turbo build.
- The root `package.json` pins `next` exactly, because Vercel needs it to detect Next.js. Bump it together with `apps/web`'s `next`.

## Dependency ceilings

`bun update --latest` can quietly break lint, so hold these:

- `typescript` stays below 6.1 and `eslint` below 10, until `typescript-eslint` and `eslint-plugin-react` declare support.
- Biome stays at `2.3.11` and ultracite at `7.0.12`. Newer versions add thousands of new errors.
- These are held on purpose:
  - `@central-icons-react/all` 1.1.x: 1.2 breaks the Icon wrapper's types.
  - fumadocs 15, fumadocs-mdx 11, and shiki 3: upgrading means a docs migration.
  - `@visx/brush` 3.
  - `@types/node` 22.
- If `next dev` reloads nonstop with "Next.js package not found", delete `apps/web/.next` and restart.

## Launch status (2026-10-03)

- **The shadcn directory entry** is prepared but not submitted; `.shadcn.md` has the steps.
  - The owner opens that PR from their own GitHub account.
  - Don't announce it or change the install docs until it is merged.
- **The contact form** needs the Turnstile keys set in production before it works there.
