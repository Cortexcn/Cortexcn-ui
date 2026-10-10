# design-md-mcp

A stdio MCP server for the DESIGN.md design systems in [`design-systems/`](../../design-systems). It reads that folder directly, so there is one source of truth: `bun run ds:ingest` and `bun run ds:build` update it, and `bun run validate:ds` checks it.

The systems are community "inspired by" descriptions of public websites, fetched with the getdesign CLI ([VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), MIT). They are unofficial and not affiliated with the brands they describe. Every value a DESIGN.md does not state is listed in that system's `meta.json` gaps, with how it was derived.

## Tools

| Tool | What it does |
| --- | --- |
| `list_design_systems({ tags? })` | Each system's id, name, tags, and a one-line description of the look. A system must have every tag given. |
| `get_design_system({ id, format })` | `md`: the original DESIGN.md. `tokens`: the normalized tokens and meta. `css`: its `theme.css`. `tailwind`: CSS plus the Tailwind v4 `@theme` mapping, and a Tailwind v3 preset. |
| `get_component({ id, component })` | One recipe (`button`, `input`, `card`, `badge`, `tabs`, `accordion`, `dialog`, `menu`, `control`, `tooltip`, `alert`) with resolved values, its CSS variables, light and dark colors, and a usage snippet. |
| `compare_design_systems({ ids })` | A markdown table of the tokens that differ between two to six systems. |
| `apply_design_system({ id, projectPath, dryRun = true })` | Detects Tailwind v3 or v4 and returns the exact unified diff: theme CSS, the Tailwind mapping, font setup, and a DESIGN.md copy. Writes only when `dryRun` is false. |

Resource: `design-system://<id>/DESIGN.md`.

### What `apply_design_system` changes

- **Tailwind v4:** appends `:root` and `.dark` variables, an `@theme inline` mapping (colors, `font-sans`, radius, shadows), and a `body` rule to the global stylesheet, between `design-md-mcp:start` and `design-md-mcp:end` comments. Running it again replaces that block, so switching systems is one call.
- **Tailwind v3:** appends the same variables, writes `tailwind.design-system.cjs`, and adds it to `presets` in `tailwind.config`.
- **Fonts:** in a Next.js app, writes `app/design-system-fonts.ts` with `next/font/google` and adds its class to `<html>` in the root layout. Elsewhere, adds a Google Fonts `@import`. The fonts are the open-licensed stand-ins recorded in each system's `meta.json`.
- **DESIGN.md:** copied to the project root, or to `DESIGN.<id>.md` when the project already has its own.

Dark mode follows the `.dark` class on `<html>`, the shadcn convention.

## Build

From the repo root:

```sh
bun install
bun run --filter @cortexcn/design-md-mcp build
```

That bundles the server and the shared schema into `packages/design-md-mcp/dist/index.js`, which runs on Node 18 or later. During development you can skip the build and run `bun packages/design-md-mcp/src/index.ts`.

The server finds `design-systems/` relative to itself. To use another copy, pass `--dir <path>` or set `DESIGN_SYSTEMS_DIR`.

## Add it to Claude Code

```sh
claude mcp add design-md -- node /absolute/path/to/cortexcn/packages/design-md-mcp/dist/index.js
```

Add `--scope project` to write it to the current project's `.mcp.json` instead of your user config.

## `.mcp.json` example

For a project that should always have the design systems available:

```json
{
  "mcpServers": {
    "design-md": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/cortexcn/packages/design-md-mcp/dist/index.js"],
      "env": {
        "DESIGN_SYSTEMS_DIR": "/absolute/path/to/cortexcn/design-systems"
      }
    }
  }
}
```

Then ask your agent, for example: "List the dark-first design systems, compare linear and raycast, then dry-run applying linear to this project."
