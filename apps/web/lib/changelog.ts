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

export const CHANGELOG: ChangelogRelease[] = [
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
