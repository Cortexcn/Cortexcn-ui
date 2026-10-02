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
  { label: "Reasoning", href: "/blocks/ai-assistant#ai-reasoning-01" },
  {
    label: "Chain of Thought",
    href: "/blocks/ai-assistant#ai-chain-of-thought-01",
  },
  { label: "Shimmer", href: "/blocks/ai-assistant#ai-shimmer-01" },
];

export const CHANGELOG: ChangelogRelease[] = [
  {
    date: "2026-10-02",
    kind: "blocks",
    title: "Hero blocks, starting with Dashboard Preview",
    summary:
      "A new Hero category opens with a serif headline, a short pitch, and one call to action over a framed product dashboard on a soft photo wash. It animates in on scroll and stays still for visitors who ask for reduced motion.",
    items: [
      { label: "Hero blocks", href: "/blocks/hero" },
      { label: "Dashboard Preview", href: "/blocks/hero#hero-dashboard-01" },
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
        href: "/blocks/features#feature-bento-grid-01",
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
    items: [{ label: "Feature blocks", href: "/blocks/features" }],
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
      { label: "Feature blocks", href: "/blocks/features" },
      { label: "Stat card blocks", href: "/blocks/stat-cards" },
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
