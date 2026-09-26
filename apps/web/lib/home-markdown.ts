import { DOCS_URL, SITE_URL } from "@/lib/site-url";

/**
 * The landing page as markdown, served at /index.md for AI agents. Keep it in
 * step with the copy in components/landing when that changes.
 */
export const HOME_MARKDOWN = `# Cortexcn

> Cortexcn is a shadcn/ui registry of React components, charts, and blocks. Install them with one command, or let your AI agent build with them. Built for freelancers, developers, and startups who ship fast.

Your AI agent ships landing pages, dashboards, portfolios, storefronts, and pricing pages from real components.

Add components from the Cortexcn registry with one command, or let your AI agent pull them in. Real React code that you own and can change.

- [Get started](${DOCS_URL}/docs/installation)
- [Browse components](${DOCS_URL}/docs/components)
- [Browse blocks](${SITE_URL}/blocks)

Built for shadcn/ui and Next.js. Works with Next.js, React, Tailwind CSS, shadcn/ui, Cursor, and Claude.

## Why Cortexcn

1. **Real components.** Your agent builds with tested React components from the registry, not markup it made up a minute ago.
2. **One command.** Run one shadcn command and the component lands in your project, typed and ready to use.
3. **Yours to edit.** The code lives in your repo. Change the markup, the props, or the styles. Tailwind keeps it on theme.

## Core capabilities

- **Component registry.** Charts, blocks, and UI components in one registry, each with docs, live examples, and an install command.
- **Agent ready.** Point Claude Code, Cursor, or Codex at the registry. Your agent finds the right component and installs it.
- **Ships as your code.** Components copy into your repo as plain React and Tailwind, so you can change anything you like.
- **Small by default.** Install only the parts you use. Nothing ships that you did not add.
- **Grows with you.** Start with one chart. Add blocks and full pages as the product grows.

## Installation

### CLI

Add the registry once, then install any component with the shadcn CLI.

\`\`\`bash
# 1. Set up shadcn/ui (skip if you have it)
npx shadcn@latest init

# 2. Add the registry to components.json
#    "@cortexcn": "${DOCS_URL}/r/{name}.json"

# 3. Install any component
npx shadcn@latest add @cortexcn/marquee
npx shadcn@latest add @cortexcn/area-chart
\`\`\`

### AI agent

Give your agent the shadcn MCP server, then ask for a component by name.

\`\`\`bash
npx shadcn@latest mcp init --client claude
\`\`\`

Then ask, for example: "Add the @cortexcn marquee to my landing page and fill it with our customer logos."

### React

Import it like any other component in your app and pass your own content.

\`\`\`tsx
import { Marquee } from "@/components/marquee";

export function Logos() {
  return (
    <Marquee pauseOnHover className="[--duration:30s]">
      <img src="/logos/nextjs.svg" alt="Next.js" />
      <img src="/logos/react.svg" alt="React" />
    </Marquee>
  );
}
\`\`\`

## Pricing (preview)

Paid plans are not live yet. Every component in the registry can be browsed and installed today.

- **Free:** every component in the registry, charts, blocks, and UI, install with the shadcn CLI, community support.
- **Pro (preview):** premium blocks and page templates, guided MCP setup for your agent, early access to new components, email support.
- **Team (preview):** seats for your whole team, a private registry for your components, priority component requests, priority support.

## Changelog

- **Sep 26, 2026. Six new UI components.** Marquee, Line Nav, Logos Carousel, Theme Toggle Effect, Work Experience, and Perspective Marquee, each with CLI and manual install steps.
- **Sep 26, 2026. Blocks, sorted by category.** Feature and stat card blocks now live in categories, each with a live preview you can copy from.
- **Sep 20, 2026. The @cortexcn registry.** Every chart moved to the @cortexcn namespace. Install any of them from ui.cortexcn.dev with the shadcn CLI.

## FAQ

**What is Cortexcn?**
A registry of React components, charts, and blocks built on shadcn/ui. You install them with the shadcn CLI, or your AI agent installs them for you.

**How do I install a component?**
Add the @cortexcn registry to your components.json once, then run \`npx shadcn@latest add\` with the component name. The source is copied into your project, so there is no package to keep updated.

**Does it work with my AI agent?**
Yes. Any agent that can run the shadcn CLI or use the shadcn MCP server can install Cortexcn components. That includes Claude Code, Cursor, and Codex.

**Can I change the code?**
Yes. Components live in your repo as plain React and Tailwind. Edit the markup, props, or styles, and theme everything with your own CSS variables.

**What does it cost?**
You can browse and install every component in the registry today. Paid plans with premium blocks and templates are on the way.

## Links

- [Documentation](${DOCS_URL}/docs)
- [llms.txt](${SITE_URL}/llms.txt)
- [Full documentation for agents](${SITE_URL}/llms-full.txt)
- [Registry index](${DOCS_URL}/r/registry.json)
- Built by [Syed Moinuddin](https://syedmoinuddin.com)
`;
