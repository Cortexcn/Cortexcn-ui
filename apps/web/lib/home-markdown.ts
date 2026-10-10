import { COMPONENT_COUNT_LABEL } from "@/lib/component-count";
import {
  ADD_ONS,
  CARE_PLAN_MONTHLY_PRICE,
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
import { SERVICES } from "@/lib/services";
import { PROOF_STATS } from "@/lib/site-config";
import { DOCS_URL, SITE_URL } from "@/lib/site-url";
import { CLIENT_TESTIMONIALS } from "@/lib/testimonials";
import { WORK } from "@/lib/work";

function timeline(title: string) {
  return SERVICE_PRICES.find((price) => price.title === title)?.timeline ?? "";
}

/** The case studies in the Built with Cortexcn section, in page order. */
const WORK_LINES = WORK.map(
  (study) =>
    `- **${study.title}** (${study.clientType}). ${study.summary} Result: ${study.result.value} ${study.result.label}. [Read the case study](${SITE_URL}/work/${study.slug}).`,
).join("\n");

const PROOF_LINE = [
  `${PROOF_STATS.components ?? COMPONENT_COUNT_LABEL} components`,
  PROOF_STATS.installsThisMonth === null
    ? null
    : `${PROOF_STATS.installsThisMonth.toLocaleString("en-US")} installs this month`,
  PROOF_STATS.clientProjects === null
    ? null
    : `${PROOF_STATS.clientProjects} client projects shipped`,
  PROOF_STATS.templatesSold === null
    ? null
    : `${PROOF_STATS.templatesSold.toLocaleString("en-US")} templates sold`,
]
  .filter(Boolean)
  .join(" · ");

const TESTIMONIAL_SECTION =
  CLIENT_TESTIMONIALS.length > 0
    ? `## What clients say

${CLIENT_TESTIMONIALS.map(
  (item) =>
    `> ${item.quote}\n>\n> ${[item.name, item.role, item.company].filter(Boolean).join(", ")}`,
).join("\n\n")}

`
    : "";

const SERVICE_LINES = SERVICES.map((service, index) => {
  const price = SERVICE_PRICES.find((item) => item.title === service.title);
  const from = price
    ? ` From ${formatUsd(price.price)}${cadenceLabel(price.cadence)}, ${price.timeline.toLowerCase()}.`
    : "";
  return `${index + 1}. **${service.title}.** ${service.description}${from}`;
}).join("\n");

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

> I design and build landing pages, websites, online stores, web apps, and AI features on Next.js. You get a written quote before work starts, a preview link every week, and code that lives in your repo.

I design and build landing pages, websites, online stores, web apps, and AI features for your business. Built by [Syed Moinuddin](${SITE_URL}/about).

Tell me what you need. You get a written quote before any work starts, a preview link to click through every week, and a fast Next.js site whose code lives in your repo.

- [Start a project](${SITE_URL}/contact)
- [See every service](${SITE_URL}/services)
- [See every price](${SITE_URL}/pricing)

Projects from ${formatUsd(Math.min(...Object.values(PROJECT_STARTING_PRICES)))}. A preview link every week. 30 days of fixes after launch.

${PROOF_LINE}

## What I build

From a landing page to a full product. Starting prices are in US dollars, and every project still gets a written quote.

${SERVICE_LINES}

Something else in mind? Tell me what you are building and where you are stuck through the [contact form](${SITE_URL}/contact). I reply by email.

## How I work

From the first email to launch.

1. **Tell me what you need.** Write in through the contact form or by email: what you are building, and where you are stuck. I reply by email.
2. **Get a written quote.** After a short call or a few emails, you get a quote with scope, price, and timeline. That quote is what you pay: 50% to start and 50% before launch.
3. **See it every week.** Every week you get an update and a preview link to click through, in a shared Slack channel or the tool your team already uses.
4. **Launch with your code.** The code lives in your repo, built from the same tested components as Cortexcn. Every project includes 30 days of fixes after launch.

Built with Next.js, React, TypeScript, Tailwind CSS, Node.js, and PostgreSQL. Hire me per project, with a fixed scope and a written quote, or on retainer, with me on your team every month.

## Built with Cortexcn

${WORK_LINES}

Every case study: [${SITE_URL}/work](${SITE_URL}/work).

${TESTIMONIAL_SECTION}
## Our component library

Components in. Finished pages out. Every client project I build starts from the Cortexcn library, and you can use it yourself.

- **Component registry.** Charts, blocks, and UI components in one registry, each with docs, live examples, and an install command.
- **Agent ready.** Point Claude Code, Cursor, or Codex at the registry. Your agent finds the right component and installs it.
- **Ships as your code.** Components copy into your repo as plain React and Tailwind, so you can change anything you like.
- **Works with your stack.** Next.js, React, Tailwind, and the AI tools you already use.
- **Small by default.** Install only the parts you use. Nothing ships that you did not add.
- **Grows with you.** Start with one chart. Add blocks and full pages as the product grows.

## For developers

Connect your agent. Ask for any component. The Cortexcn MCP server is hosted at https://ui.cortexcn.dev/mcp, with nothing to install and no sign-in. Your agent searches the registry, reads the docs, and runs the install command in your project. [Set up MCP](${DOCS_URL}/docs/integration/mcp).

### Claude Code

\`\`\`bash
claude mcp add --transport http cortexcn https://ui.cortexcn.dev/mcp

# Or connect it once for every project
claude mcp add --transport http --scope user cortexcn https://ui.cortexcn.dev/mcp

# The project needs shadcn set up (skip if it has components.json)
npx shadcn@latest init
\`\`\`

### Cursor, VS Code, and Codex

Every client uses the same URL.

\`\`\`json
// Cursor: .cursor/mcp.json
{ "mcpServers": { "cortexcn": { "url": "https://ui.cortexcn.dev/mcp" } } }

// VS Code with Copilot: .vscode/mcp.json
{ "servers": { "cortexcn": { "type": "http", "url": "https://ui.cortexcn.dev/mcp" } } }
\`\`\`

\`\`\`bash
codex mcp add cortexcn --url https://ui.cortexcn.dev/mcp
\`\`\`

### Ask for it

Ask in plain words, for example: "Add the Lanyard 3D component to the about page." Your agent calls \`search_items\`, \`get_item\`, and \`get_install_command\`, then runs \`npx shadcn@latest add https://ui.cortexcn.dev/r/lanyard-3d.json\` in your project. The other tools are \`list_items\`, \`list_categories\`, \`get_item_source\`, \`get_setup_guide\`, and \`get_design_guide\`.

## Pricing

Clear prices. Hire me by the project. Prices are in US dollars. Client work has starting prices, and every project gets a written quote with scope, price, and timeline before work starts. Components are free to start, and the paid plans are paid once, with no subscription. Every price and a project estimator: [${SITE_URL}/pricing](${SITE_URL}/pricing).

### Project packages

${packageLines(PROJECT_PACKAGES)}

### Monthly retainers

${packageLines(RETAINERS)}

### Component plans

${packageLines(COMPONENT_PLANS)}

### Estimate a project

The [estimator](${SITE_URL}/pricing#estimate) adds up a project from its starting price, the page count, and the extras it needs.

${ESTIMATOR_LINES}

### Every service

${SERVICE_PRICES.map((service) => `- **${service.title}:** from ${formatUsd(service.price)}${cadenceLabel(service.cadence)}, ${service.timeline.toLowerCase()}. ${service.includes.join(", ")}.`).join("\n")}

### Add-ons

${ADD_ONS.map((addOn) => `- **${addOn.name}:** ${addOn.price}${addOn.unit ?? ""}. ${addOn.detail}`).join("\n")}

## FAQ

**What does a project cost?**
Landing pages start at ${formatUsd(PROJECT_STARTING_PRICES.landing)}, websites at ${formatUsd(PROJECT_STARTING_PRICES.website)}, online stores at ${formatUsd(PROJECT_STARTING_PRICES.store)}, and web apps at ${formatUsd(PROJECT_STARTING_PRICES.app)}. After a short call or a few emails, you get a written quote with scope, price, and timeline, and that quote is what you pay.

**How long does it take?**
A landing page usually takes ${timeline("Landing pages")}, a website ${timeline("Websites")}, an online store ${timeline("E-commerce")}, and a web app ${timeline("Web apps + APIs")}. Your quote sets the exact dates before work starts.

**How do payments work?**
Projects are paid in two parts: 50% to start and 50% before launch. Retainers are billed monthly in advance. Every price is in US dollars, and project deposits are refunded in full until work starts.

**Will I see the work before launch?**
Yes. Every week you get an update and a preview link to click through, in a shared Slack channel or the tool your team already uses.

**Who owns the code?**
You do. The code lives in your repo, so you can host it anywhere and hand it to any developer later.

**What happens after launch?**
Every project includes 30 days of fixes after launch. After that, the care plan covers updates and small fixes for ${formatUsd(CARE_PLAN_MONTHLY_PRICE)} a month, or I quote bigger changes as a new project.

**Can you work on a site I already have?**
Yes. I take on work in codebases that already exist, most often Next.js, React, and TypeScript. If yours runs on something else, tell me, and I will say honestly whether I am the right fit.

**What is the component library?**
Cortexcn is also a library of React components, charts, and blocks that I build every project on. ${FREE_PLAN_LIMITS.components} components are free, and Pro (${formatUsd(COMPONENT_PLAN_PRICES.pro)}) and Ultra (${formatUsd(COMPONENT_PLAN_PRICES.ultra)}) are paid once, if you want to use them yourself.

## Links

- [Start a project](${SITE_URL}/contact)
- [Services](${SITE_URL}/services)
- [Work](${SITE_URL}/work)
- [About](${SITE_URL}/about)
- [Documentation](${DOCS_URL}/docs)
- [llms.txt](${SITE_URL}/llms.txt)
- [Full documentation for agents](${SITE_URL}/llms-full.txt)
- [Registry index](${DOCS_URL}/r/registry.json)
- Built by [Syed Moinuddin](https://syedmoinuddin.com)
`;
