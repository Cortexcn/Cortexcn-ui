/**
 * Every Cortexcn release, newest first. The /changelog page on the component
 * library site lists them all, and the services landing shows the latest
 * three, so add a release here and both update. Dates come from the
 * repository history.
 */

export interface ChangelogLink {
  label: string;
  href: string;
}

export type ChangelogKind = "components" | "blocks" | "site";

export interface ChangelogRelease {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  kind: ChangelogKind;
  title: string;
  summary: string;
  /** What shipped, each linking to its page. */
  items: ChangelogLink[];
}

function componentLinks(names: [string, string][]): ChangelogLink[] {
  return names.map(([label, slug]) => ({
    label,
    href: `/docs/components/${slug}`,
  }));
}

/** The AI Assistant pieces, which now live under Blocks. */
const AI_ASSISTANT_BLOCK_LINKS: ChangelogLink[] = [
  { label: "Reasoning", href: "/blocks/ai-assistant/ai-reasoning-01" },
  {
    label: "Chain of Thought",
    href: "/blocks/ai-assistant/ai-chain-of-thought-01",
  },
  { label: "Shimmer", href: "/blocks/ai-assistant/ai-shimmer-01" },
];

export const CHANGELOG: ChangelogRelease[] = [
  {
    date: "2026-10-05",
    kind: "site",
    title: "Rate limits on the MCP server",
    summary:
      "The MCP server now takes up to 120 requests a minute and 3,000 a day from each IP address. Over a limit, your assistant gets a 429 with a Retry-After header and a message that says how long to wait.",
    items: [{ label: "MCP Server", href: "/docs/integration/mcp" }],
  },
  {
    date: "2026-10-03",
    kind: "site",
    title: "The Cortexcn MCP server, agent skills, and DESIGN.md",
    summary:
      "Connect your AI assistant to https://ui.cortexcn.dev/mcp and it can search every component, block, and chart, read the docs and props, and get the install command. Two agent skills and a DESIGN.md generated from the theme tokens install with one command, so new UI follows the Cortexcn look. Every install box now has an MCP tab.",
    items: [
      { label: "MCP Server", href: "/docs/integration/mcp" },
      { label: "Skills", href: "/docs/integration/skills" },
      { label: "DESIGN.md", href: "/docs/integration/design-md" },
    ],
  },
  {
    date: "2026-10-02",
    kind: "components",
    title: "Lanyard 3D",
    summary:
      "A 3D ID badge on a strap, drawn with three.js. Drag it, throw it, and watch the strap twist as the card turns, then click it to flip it over. The badge is drawn from props with your logo, name, and colors, and the physics is written in the component, so the only dependency is three.",
    items: componentLinks([["Lanyard 3D", "lanyard-3d"]]),
  },
  {
    date: "2026-10-02",
    kind: "components",
    title: "Lanyard Badge, Gooey Nav, and Sphere Menu",
    summary:
      "Three playful components with no extra dependencies. Lanyard Badge hangs an ID card from a simulated strap that you can drag, throw, and flip. Gooey Nav stretches a liquid pill between links. Sphere Menu spins a ball of image tiles and turns the nearest one to face you with its link.",
    items: componentLinks([
      ["Lanyard Badge", "lanyard-badge"],
      ["Gooey Nav", "gooey-nav"],
      ["Sphere Menu", "sphere-menu"],
    ]),
  },
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "Queue joins the AI Assistant blocks",
    summary:
      "Queue shows what an agent has lined up: the messages waiting their turn, with their images and files and a way to drop one, above the run's todo list. Each section folds away.",
    items: [{ label: "Queue", href: "/blocks/ai-assistant/ai-queue-01" }],
  },
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "Loaders: Dot Matrix and Glitch Text",
    summary:
      "A new Loaders category opens with two loading indicators, each shown four ways. Dot Matrix pulses a grid of dots in a ripple, wave, or rain pattern, and Glitch Text scrambles its letters and splits them into color channels.",
    items: [
      { label: "Dot Matrix", href: "/blocks/loaders/loader-dot-matrix-01" },
      { label: "Glitch Text", href: "/blocks/loaders/loader-glitch-text-01" },
      { label: "Loader blocks", href: "/blocks?category=loaders" },
    ],
  },
  {
    date: "2026-10-02",
    kind: "site",
    title: "A page for every block, and a live preview",
    summary:
      "Each block now opens on its own page with its preview, code, and install command. The eye button opens it full screen in a new tab, with a bar to switch the theme or jump to the code.",
    items: [{ label: "Blocks", href: "/blocks" }],
  },
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "Two more Hero blocks: Studio and Cover Photo",
    summary:
      "Studio sets a short tagline beside a serif headline over a wide landscape that fades into the page. Cover Photo lays the title, a small label, and one light call to action along the bottom of a full-bleed photo.",
    items: [
      { label: "Studio", href: "/blocks/hero/hero-studio-01" },
      { label: "Cover Photo", href: "/blocks/hero/hero-cover-01" },
    ],
  },
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "Hero blocks, starting with Dashboard Preview",
    summary:
      "A new Hero category opens with a serif headline, a short pitch, and one call to action over a framed product dashboard on a soft photo wash. It animates in on scroll and stays still for visitors who ask for reduced motion.",
    items: [
      { label: "Hero blocks", href: "/blocks?category=hero" },
      { label: "Dashboard Preview", href: "/blocks/hero/hero-dashboard-01" },
    ],
  },
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "AI Assistant moves to Blocks",
    summary:
      "Reasoning, Chain of Thought, and Shimmer now live under Blocks in a new AI Assistant category, each with a live preview, its code, and a one-command install. Their old component pages redirect there.",
    items: [
      ...AI_ASSISTANT_BLOCK_LINKS,
      { label: "AI Assistant blocks", href: "/blocks?category=ai-assistant" },
    ],
  },
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "Feature Bento Grid block",
    summary:
      "Photo tiles, logo tiles, and stat cards on a twelve-column bento grid, with one call to action. Every image, figure, and caption is a prop.",
    items: [
      {
        label: "Feature blocks",
        href: "/blocks/features/feature-bento-grid-01",
      },
    ],
  },
  {
    date: "2026-10-01",
    kind: "components",
    title: "AI Assistant components",
    summary:
      "A new family for chat and agent interfaces. Reasoning streams a model's thinking as markdown and folds away when it finishes, Chain of Thought lays out an agent's steps with sources and status, and Shimmer marks the moments in between.",
    items: AI_ASSISTANT_BLOCK_LINKS,
  },
  {
    date: "2026-10-01",
    kind: "components",
    title: "Fan-Out Diagram",
    summary:
      "An animated architecture diagram for landing pages: one source feeds a hub that fans out to a row per sandbox, worker, or agent, each with a live status. It draws in on scroll and sends packets along the lines while it is on screen.",
    items: [
      { label: "Fan-Out Diagram", href: "/docs/components/fan-out-diagram" },
    ],
  },
  {
    date: "2026-09-29",
    kind: "components",
    title: "Every shadcn/ui component",
    summary:
      "51 components from shadcn/ui join the registry, from Button and Dialog to Combobox, Calendar, and Sidebar. Each page carries the examples from the shadcn docs, ready to copy, and the family formerly called Neurons is now simply Components.",
    items: [
      ...componentLinks([
        ["Button", "button"],
        ["Dialog", "dialog"],
        ["Dropdown Menu", "dropdown-menu"],
        ["Combobox", "combobox"],
        ["Calendar", "calendar"],
        ["Sonner", "sonner"],
        ["Kbd", "kbd"],
        ["Sidebar", "sidebar"],
      ]),
      { label: "All components", href: "/docs/components" },
    ],
  },
  {
    date: "2026-09-29",
    kind: "blocks",
    title: "Feature Studio Grid block",
    summary:
      "Two compact cards and a large photo tile for posts, case studies, or launches. Every image, title, and link is a prop.",
    items: [{ label: "Feature blocks", href: "/blocks?category=features" }],
  },
  {
    date: "2026-09-29",
    kind: "site",
    title: "A home for the component library",
    summary:
      "ui.cortexcn.dev now opens on its own home page, and the docs, blocks, and charts all live on the component library site with their own navigation.",
    items: [
      { label: "Library home", href: "/" },
      { label: "Blocks", href: "/blocks" },
      { label: "Charts", href: "/charts/area-chart" },
    ],
  },
  {
    date: "2026-09-28",
    kind: "components",
    title: "Command Search, Number Ticker, and FAQ Tabs Card",
    summary:
      "A command palette that types its own queries, a rolling digit ticker, and a tabbed FAQ card join the Cortex family.",
    items: componentLinks([
      ["Command Search", "command-search"],
      ["Number Ticker", "number-ticker"],
      ["FAQ Tabs Card", "faq-tabs-card"],
    ]),
  },
  {
    date: "2026-09-27",
    kind: "components",
    title: "Backgrounds, starting with Light Speed",
    summary:
      "A new family for animated, full-bleed backgrounds. Light Speed draws a tunnel of light streaks with WebGL.",
    items: componentLinks([["Light Speed", "light-speed"]]),
  },
  {
    date: "2026-09-26",
    kind: "components",
    title: "Six new UI components",
    summary:
      "Marquee, Line Nav, Logos Carousel, Theme Toggle Effect, Work Experience, and Perspective Marquee, each with CLI and manual install steps.",
    items: componentLinks([
      ["Marquee", "marquee"],
      ["Line Nav", "line-nav"],
      ["Logos Carousel", "logos-carousel"],
      ["Theme Toggle Effect", "theme-toggle-effect"],
      ["Work Experience", "work-experience"],
      ["Perspective Marquee", "perspective-marquee"],
    ]),
  },
  {
    date: "2026-09-26",
    kind: "blocks",
    title: "Blocks, sorted by category",
    summary:
      "Feature and stat card blocks now live in categories, each with a live preview you can copy from.",
    items: [
      { label: "Feature blocks", href: "/blocks?category=features" },
      { label: "Stat card blocks", href: "/blocks?category=stat-cards" },
    ],
  },
  {
    date: "2026-09-20",
    kind: "site",
    title: "The @cortexcn registry",
    summary:
      "Every chart moved to the @cortexcn namespace. Install any of them from ui.cortexcn.dev with the shadcn CLI.",
    items: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Charts", href: "/charts/area-chart" },
    ],
  },
];

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** "Sep 29, 2026", the same for every visitor. */
export function formatChangelogDate(iso: string) {
  return DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`));
}

export interface ChangelogDay {
  /** `YYYY-MM-DD`. */
  date: string;
  /** That day's releases, in the order they are listed above. */
  releases: ChangelogRelease[];
}

/** Releases grouped by the day they shipped, newest day first. */
export function groupChangelogByDay(
  releases: ChangelogRelease[] = CHANGELOG,
): ChangelogDay[] {
  const days = new Map<string, ChangelogRelease[]>();

  for (const release of releases) {
    const day = days.get(release.date);
    if (day) {
      day.push(release);
    } else {
      days.set(release.date, [release]);
    }
  }

  return Array.from(days, ([date, dayReleases]) => ({
    date,
    releases: dayReleases,
  })).sort((a, b) => b.date.localeCompare(a.date));
}
