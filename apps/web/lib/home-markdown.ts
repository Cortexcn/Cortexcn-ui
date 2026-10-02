import { CHANGELOG, formatChangelogDate } from "@/lib/changelog";
import {
  ADD_ONS,
  COMPONENT_PLAN_PRICES,
  COMPONENT_PLANS,
  cadenceLabel,
  countLabel,
  ESTIMATOR_OPTIONS,
  ESTIMATOR_PROJECTS,
  FREE_PLAN_LIMITS,
  formatUsd,
  PROJECT_PACKAGES,
  PROJECT_STARTING_PRICES,
  type PricedPackage,
  RETAINERS,
  RUSH,
  SERVICE_PRICES,
} from "@/lib/service-pricing";
import { DOCS_URL, SITE_URL } from "@/lib/site-url";

function planPrice(item: PricedPackage) {
  if (item.cadence === "once") {
    return item.price === 0 ? "free" : `${formatUsd(item.price)}, paid once`;
  }
  return `from ${formatUsd(item.price)}${cadenceLabel(item.cadence)}`;
}

function packageLines(packages: PricedPackage[]) {
  return packages
    .map((item) =>
      [
        `- **${item.name}** (${planPrice(item)}, ${item.tag.toLowerCase()}): ${item.summary}`,
        ...item.features.map((feature) => `  - ${feature}`),
      ].join("\n"),
    )
    .join("\n");
}

const ESTIMATOR_LINES = [
  ...ESTIMATOR_PROJECTS.map(
    (project) =>
      `- **${project.label}:** from ${formatUsd(project.base)} with ${countLabel(project, project.basePages)}, then ${formatUsd(project.pagePrice)} for each extra ${project.unit.one}.`,
  ),
  ...ESTIMATOR_OPTIONS.map(
    (option) =>
      `- **${option.label}:** ${formatUsd(option.price.amount)}${option.price.perPage ? " a page" : ""}. ${option.detail}`,
  ),
  `- **${RUSH.label}:** ${RUSH.priceLabel}. ${RUSH.detail}`,
].join("\n");

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
- [Browse blocks](${DOCS_URL}/blocks)

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

# 2. Add the registry to components.json:
#    "registries": { "@cortexcn": "${DOCS_URL}/r/{name}.json" }

# 3. Install a chart and a marquee in one command
npx shadcn@latest add @cortexcn/area-chart @cortexcn/marquee
\`\`\`

### AI agent

Connect the Cortexcn MCP server, then ask for what you need. It searches every component, block, and chart, and gives your agent the install command and the docs.

\`\`\`bash
claude mcp add --transport http cortexcn https://ui.cortexcn.dev/mcp
# Cursor, VS Code, Windsurf, Codex, and others: https://ui.cortexcn.dev/docs/integration/mcp
\`\`\`

Add the agent skills and DESIGN.md so new UI follows the Cortexcn look:

\`\`\`bash
npx shadcn@latest add https://ui.cortexcn.dev/r/agent-kit.json
\`\`\`

Then ask, for example: "Build a revenue section for the dashboard: an @cortexcn area chart of monthly revenue and costs, with a marquee of our customers underneath."

### React

Import it like any other component in your app and pass your own data.

\`\`\`tsx
import { Area } from "@/components/charts/area";
import { AreaChart } from "@/components/charts/area-chart";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";
import { XAxis } from "@/components/charts/x-axis";
import { Marquee } from "@/components/marquee";

// Monthly totals in thousands of dollars.
const revenue = [
  { date: new Date("2026-06"), revenue: 48.2, costs: 31.4 },
  { date: new Date("2026-07"), revenue: 53.9, costs: 33.8 },
  { date: new Date("2026-08"), revenue: 61.8, costs: 35.1 },
  { date: new Date("2026-09"), revenue: 70.4, costs: 36.9 },
];

const customers = ["Acme", "Globex", "Initech"];

export function RevenueSection() {
  return (
    <section className="grid gap-6 border p-6">
      <h2 className="font-medium text-lg">Revenue</h2>

      <AreaChart data={revenue}>
        <Grid horizontal />
        <Area dataKey="revenue" fill="var(--chart-line-primary)" />
        <Area dataKey="costs" fill="var(--chart-line-secondary)" />
        <XAxis />
        <ChartTooltip />
      </AreaChart>

      <Marquee pauseOnHover className="[--duration:30s]">
        {customers.map((name) => (
          <span className="px-6" key={name}>
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
\`\`\`

## Services

Need more than components? Hire the team behind them. We build for clients too, from a single landing page to a full product, an AI pipeline, or a research paper. Every build ships with its code in your repo. Work per project or on retainer, and [start a project](${SITE_URL}/contact) through the contact form.

1. **Websites.** Company sites and portfolios on Next.js, fast to load and easy to update.
2. **Landing pages.** Launch and campaign pages, from the first sketch to the live URL.
3. **E-commerce stores.** Product pages, cart, checkout, and payments, ready for real orders.
4. **Web applications.** Dashboards, portals, and SaaS products with sign-in, roles, and data.
5. **Backend and APIs.** APIs, databases, auth, and background jobs that hold up in production.
6. **Microservices.** Split a monolith or design new services, with queues and clean deploys.
7. **AI pipelines.** AI features built into your product: retrieval, agents, and tool calls.
8. **SEO.** Technical SEO: metadata, structured data, sitemaps, and page speed.
9. **Research papers.** Support for research papers: code, experiments, figures, and editing.
10. **Freelance work.** An extra engineer on your team, for a sprint or on a monthly retainer.

## Pricing

Prices in US dollars. Components are free to start, and the paid plans are paid once, with no subscription. Client work has starting prices, and every project gets a written quote with scope, price, and timeline before work starts. Every price and a project estimator: [${SITE_URL}/pricing](${SITE_URL}/pricing).

### Component plans

${packageLines(COMPONENT_PLANS)}

### Project packages

${packageLines(PROJECT_PACKAGES)}

### Monthly retainers

${packageLines(RETAINERS)}

### Estimate a project

The [estimator](${SITE_URL}/pricing#estimate) adds up a project from its starting price, the page count, and the extras it needs.

${ESTIMATOR_LINES}

### Every service

${SERVICE_PRICES.map((service) => `- **${service.title}:** from ${formatUsd(service.price)}${cadenceLabel(service.cadence)}, ${service.timeline.toLowerCase()}. ${service.includes.join(", ")}.`).join("\n")}

### Add-ons

${ADD_ONS.map((addOn) => `- **${addOn.name}:** ${addOn.price}${addOn.unit ?? ""}. ${addOn.detail}`).join("\n")}

## Changelog

${CHANGELOG.slice(0, 3)
  .map(
    (release) =>
      `- **${formatChangelogDate(release.date)}. ${release.title}.** ${release.summary}`,
  )
  .join("\n")}

Every release: [${DOCS_URL}/changelog](${DOCS_URL}/changelog).

## FAQ

**What is Cortexcn?**
A registry of React components, charts, and blocks built on shadcn/ui. You install them with the shadcn CLI, or your AI agent installs them for you.

**How do I install a component?**
Add the @cortexcn registry to your components.json once, then run \`npx shadcn@latest add\` with the component name. The source is copied into your project, so there is no package to keep updated.

**Does it work with my AI agent?**
Yes. Connect the Cortexcn MCP server at https://ui.cortexcn.dev/mcp and your agent can search, read, and install every component, block, and chart. It works with Claude Code, Claude, Cursor, VS Code, Windsurf, Codex, and ChatGPT. Any agent that can run the shadcn CLI can also install items by URL.

**Can I change the code?**
Yes. Components live in your repo as plain React and Tailwind. Edit the markup, props, or styles, and theme everything with your own CSS variables.

**What does it cost?**
${FREE_PLAN_LIMITS.components} components and ${FREE_PLAN_LIMITS.templates} templates are free. Pro, with every component, is ${formatUsd(COMPONENT_PLAN_PRICES.pro)}, and Ultra, with every template and every future release, is ${formatUsd(COMPONENT_PLAN_PRICES.ultra)}. Both are paid once. Client work starts at ${formatUsd(PROJECT_STARTING_PRICES.landing)} for a landing page, and the [pricing page](${SITE_URL}/pricing) has an estimator for bigger projects.

## Links

- [Documentation](${DOCS_URL}/docs)
- [llms.txt](${SITE_URL}/llms.txt)
- [Full documentation for agents](${SITE_URL}/llms-full.txt)
- [Registry index](${DOCS_URL}/r/registry.json)
- Built by [Syed Moinuddin](https://syedmoinuddin.com)
`;
