# Cortexcn

Cortexcn is a set of React and Tailwind CSS components, page blocks, and charts. You install items with the shadcn CLI, which copies the source into your project. The code is yours to read and change, and there is no runtime package to keep up to date.

- Components, docs, and registry: [ui.cortexcn.dev](https://ui.cortexcn.dev)
- Website: [www.cortexcn.dev](https://www.cortexcn.dev)

## What is in the registry

- **Components**: the shadcn/ui primitives (accordion, dialog, select, tabs, and the rest) plus Cortexcn components such as the marquee, number ticker, line nav, and sphere menu.
- **Blocks**: page sections grouped by category, such as hero sections, feature grids, AI assistant pieces, loaders, and stat cards. Browse them at [ui.cortexcn.dev/blocks](https://ui.cortexcn.dev/blocks).
- **Charts**: area, bar, candlestick, choropleth, composed, funnel, gauge, heatmap, line, live line, pie, radar, ring, sankey, scatter, and sunburst charts, built on visx and Motion. Browse them at [ui.cortexcn.dev/charts](https://ui.cortexcn.dev/charts).

## Install an item

Your project needs shadcn/ui set up first:

```bash
npx shadcn@latest init
```

Add an item by its registry URL:

```bash
npx shadcn@latest add https://ui.cortexcn.dev/r/line-chart.json
```

Or register the `@cortexcn` namespace once in `components.json`:

```json
{
  "registries": {
    "@cortexcn": "https://ui.cortexcn.dev/r/{name}.json"
  }
}
```

and then add items by name:

```bash
npx shadcn@latest add @cortexcn/line-chart
```

The CLI writes the files into your project, installs the npm packages the item needs, and pulls in any other Cortexcn items it depends on. Charts land in your components folder, so you import them from there:

```tsx
import { LineChart } from "@/components/charts";
```

Each item's page in the [docs](https://ui.cortexcn.dev/docs) shows its install command, usage, and props.

## AI integration

Cortexcn gives coding agents three ways to work with the registry. The setup guides are at [ui.cortexcn.dev/docs/integration](https://ui.cortexcn.dev/docs/integration).

**MCP server.** A read-only MCP server runs at `https://ui.cortexcn.dev/mcp`. It needs no sign-in and lets an agent search the catalog, read an item's source, and get its install command. To add it to Claude Code:

```bash
claude mcp add --transport http cortexcn https://ui.cortexcn.dev/mcp
```

Other MCP clients can use the same URL with the HTTP transport.

**Agent skills.** Skills that teach an agent how to find, install, compose, and theme Cortexcn items, and how to follow the design system:

```bash
npx shadcn@latest add https://ui.cortexcn.dev/r/agent-skills.json
```

**DESIGN.md.** A `DESIGN.md` file for your project root that describes the Cortexcn design system (colors, corners, type, spacing, and motion), so agents have one place to read it from:

```bash
npx shadcn@latest add https://ui.cortexcn.dev/r/design-md.json
```

## Local development

You need Node.js 18 or later (CI uses Node 20) and pnpm 9.15.9, the version pinned in `package.json`. With Corepack enabled, `pnpm` picks up that version on its own.

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts the site at <http://localhost:3000> and the component library host at <http://ui.localhost:3000>. In production one deployment serves both hosts: the library (its home, docs, blocks, charts, and registry) on `ui.cortexcn.dev`, and everything else on `www.cortexcn.dev`.

Environment variables are listed in `apps/web/.env.example`. Copy it to `apps/web/.env` and fill in the ones you need. They cover the icon license, analytics, search engine verification, and the contact form.

Scripts, all run from this folder:

| Command                | What it does                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm dev`             | Runs the dev servers through Turborepo                                                            |
| `pnpm build`           | Builds every package through Turborepo                                                            |
| `pnpm lint`            | Checks formatting and lint rules with Ultracite (Biome)                                           |
| `pnpm lint:fix`        | Applies Ultracite fixes (`pnpm format` does the same)                                             |
| `pnpm check-types`     | Type checks every package                                                                         |
| `pnpm test`            | Runs the unit tests (Node's test runner with `tsx`)                                               |
| `pnpm registry:build`  | Rebuilds the registry into `apps/web/public/r` (runs `pnpm --filter @cortexcn/ui registry:build`) |
| `pnpm registry:verify` | Checks that registry files, npm dependencies, and the built output are in sync                    |

The pre-commit hook runs `npx ultracite fix`.

## Repository layout

| Path                         | Contents                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/web`                   | The Next.js site: docs (MDX in `content/docs`), block sources (`blocks`), chart gallery, the MCP route (`app/mcp`), and the built registry JSON (`public/r`) |
| `packages/ui`                | `@cortexcn/ui`: component and chart source, `registry.json`, and the scripts that build and verify the registry                                              |
| `packages/icons`             | `@cortexcn/icons`: a wrapper around Central Icons (`@central-icons-react/all`), a licensed icon set                                                          |
| `packages/eslint-config`     | `@cortexcn/eslint-config`: shared ESLint config                                                                                                              |
| `packages/typescript-config` | `@cortexcn/typescript-config`: shared TypeScript configs                                                                                                     |
| `templates/`                 | Standalone Next.js page templates. They are not part of the pnpm workspace; each has its own README and LICENSE                                              |

Contributor and agent notes are in [AGENTS.md](./AGENTS.md).

## License

MIT, see [LICENSE](./LICENSE). Templates in `templates/` carry their own license files.
