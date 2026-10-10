---
name: cortexcn
description: Build UI with Cortexcn, the React and Tailwind CSS registry at ui.cortexcn.dev. Use when the user mentions Cortexcn or @cortexcn, asks for a component, page block, or chart in a project that uses Cortexcn, or wants to find, install, compose, or theme Cortexcn items.
---

# Cortexcn

Cortexcn is a registry of React components, page blocks, and charts built with Tailwind CSS. Items install with the shadcn CLI, which copies the source into the project, so the code belongs to the project and there is no runtime package to update.

- Site and docs: https://ui.cortexcn.dev
- Registry index: https://ui.cortexcn.dev/r/registry.json
- One item: `https://ui.cortexcn.dev/r/<name>.json`
- Any docs page as markdown: add `.md` to its URL, for example https://ui.cortexcn.dev/docs/cortex/lanyard-3d.md
- Every docs page in one file: https://ui.cortexcn.dev/llms-full.txt

## Find the right item

If the `cortexcn` MCP server is connected, use it:

1. `search_items` with what the user needs, such as "pricing hero" or "line chart with tooltip". Pass `kind` (`component`, `block`, `chart`) to narrow it.
2. `get_item` on the best match. It returns the install command, the files and dependencies, and the docs with usage and props.
3. `get_design_guide` before writing new UI around it.

Without the MCP server, read the registry index above, then the item's docs page as markdown.

Kinds of items:

- **Components**: building blocks such as buttons, dialogs, and menus, plus Cortexcn originals such as Lanyard 3D, Gooey Nav, and Sphere Menu.
- **Blocks**: whole page sections such as heroes, feature grids, loaders, stat cards, and AI assistant pieces. Their props have defaults filled with example content, so they render as soon as they are added.
- **Charts**: composable charts. A chart is assembled from parts (the chart, grid, axes, tooltip, legend), so read its docs page for the parts it takes.

## Install

The project needs shadcn set up. If there is no `components.json` in the project root, run `npx shadcn@latest init` first.

Install by URL, which needs no further setup:

```bash
npx shadcn@latest add https://ui.cortexcn.dev/r/lanyard-3d.json
```

Several items at once:

```bash
npx shadcn@latest add https://ui.cortexcn.dev/r/hero-studio-01.json https://ui.cortexcn.dev/r/area-chart.json
```

To install by name, add the registry to `components.json` once:

```json
{
  "registries": {
    "@cortexcn": "https://ui.cortexcn.dev/r/{name}.json"
  }
}
```

Then `npx shadcn@latest add @cortexcn/lanyard-3d`. Use the package manager the project already uses (`pnpm dlx`, `npx`, or `bunx --bun`).

The CLI installs the item's npm dependencies and the other registry items it needs. Read the files it reports and import from the paths it wrote them to, which follow the aliases in `components.json` (usually `@/components/<name>`).

## Use it well

- Read the props from the docs. Never guess a prop or an item name.
- The installed files are the project's own code. Edit them when the design needs it, and keep their `data-slot` attributes, which other styles and tests rely on.
- Interactive items are client components (`"use client"`). In the Next.js App Router, keep them in client files or pass them server-rendered children.
- Compose before you create: check whether a Cortexcn item already does the job before writing a new one.
- Blocks are starting points. Replace the example copy, links, and images with the user's own through props, or edit the block's file.

## Look and feel

Cortexcn has a square, quiet look. Follow the project's `DESIGN.md` if it has one (install it with `npx shadcn@latest add https://ui.cortexcn.dev/r/design-md.json`, or read it from `get_design_guide`). In short:

- Colors come from theme tokens only: `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `ring-ring`, and `--chart-1` to `--chart-5` for data. No hard-coded hex values.
- Corners come from the radius scale (`rounded-md`, `rounded-lg`), which Cortexcn sets to square with `--radius: 0`. Do not hard-code a radius such as `rounded-[12px]`.
- Every interactive element keeps a visible focus ring (`focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`).
- Light and dark mode both work from the same tokens; dark mode is the `.dark` class.
- Motion is short (100 to 300 ms), eases out, and stops when the user prefers reduced motion.

## Check before you finish

- The install command ran without errors and the imports resolve.
- No hard-coded colors or radii were added.
- It works in light and dark mode, with the keyboard, and with reduced motion.
