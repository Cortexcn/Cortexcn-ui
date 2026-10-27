import type { IconName } from "@cortexcn/icons";
import { BLOCK_CATEGORIES } from "@/blocks/categories";
import { BLOCK_METAS } from "@/blocks/metas";
import { CHANGELOG } from "@/lib/changelog";
import { COMPONENT_GROUPS } from "@/lib/component-families";
import { componentGroupOf } from "@/lib/component-groups";
import { contactHref } from "@/lib/contact/prefill";
import { SERVICES } from "@/lib/services";
import { SITE_TEMPLATES, type ThemedImage } from "@/lib/site-templates";
import { source } from "@/lib/source";

/**
 * The header's nav items and the menus they open, for both sites. Built on
 * the server from the changelog, the docs, the block categories, and the
 * templates, then handed to the header as plain data.
 */

export interface NavMenuLink {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  /** Quiet text after the label, such as a count. */
  meta?: string;
  isNew?: boolean;
}

export interface NavMenuPanel {
  title: string;
  /**
   * `grid`: plain links in columns. `rich`: an icon, the label, and a line of
   * description. `list`: an icon and the label.
   */
  layout: "grid" | "rich" | "list";
  columns?: 1 | 2 | 3;
  links: NavMenuLink[];
  /** A "Browse all" link under the panel. */
  footer?: NavMenuLink;
}

/** What the card on the right of a menu shows: a line drawing or a screenshot. */
export type NavMenuVisual =
  | { kind: "art"; art: string }
  | {
      kind: "screenshot";
      light: string;
      dark: string;
      width: number;
      height: number;
    };

export interface NavMenuFeature {
  title: string;
  description: string;
  href: string;
  isNew?: boolean;
  visual: NavMenuVisual;
}

export interface NavMenu {
  id: string;
  label: string;
  /** Sections the menu stands for, so its trigger stays lit inside them. */
  match: string[];
  /** Pages it stands for without their subpages, such as the docs home. */
  matchExact?: string[];
  panels: NavMenuPanel[];
  feature?: NavMenuFeature;
  /** A row of small links along the bottom, such as the component families. */
  strip?: { title: string; links: NavMenuLink[] };
}

export type NavItem =
  | { kind: "link"; text: string; url: string }
  | { kind: "menu"; menu: NavMenu };

export interface NavCta {
  label: string;
  href: string;
}

/** Releases this recent get a "new" mark. */
const NEW_FOR_DAYS = 45;

function isRecent(date: string) {
  const age = Date.now() - new Date(`${date}T00:00:00Z`).getTime();
  return age < NEW_FOR_DAYS * 24 * 60 * 60 * 1000;
}

/** Releases of each kind whose pages get a "new" mark. */
const NEW_RELEASES_PER_KIND = 2;

/** Bigger releases, such as every shadcn/ui component at once, get no marks. */
const MAX_NEW_ITEMS = 3;

/**
 * The pages from the latest small releases of each kind, for "new" marks in
 * the sidebar. Kept to a handful so the mark still means something.
 */
export function recentlyShippedHrefs(): string[] {
  const taken = new Map<string, number>();
  const hrefs: string[] = [];
  for (const release of CHANGELOG) {
    const count = taken.get(release.kind) ?? 0;
    if (
      !isRecent(release.date) ||
      release.items.length > MAX_NEW_ITEMS ||
      count >= NEW_RELEASES_PER_KIND
    ) {
      continue;
    }
    taken.set(release.kind, count + 1);
    hrefs.push(...release.items.map((item) => item.href));
  }
  return hrefs;
}

const DOCS_PREFIX = /^\/docs\/?/;

/** The docs page at a URL, such as /docs/cortex/marquee. */
function docsPage(url: string) {
  return source.getPage(
    url.replace(DOCS_PREFIX, "").split("/").filter(Boolean),
  );
}

function pageTitle(url: string, fallback: string) {
  return docsPage(url)?.data.title ?? fallback;
}

function pageDescription(url: string) {
  return docsPage(url)?.data.description ?? "";
}

function screenshot(image: ThemedImage): NavMenuVisual {
  return {
    kind: "screenshot",
    light: image.light.src,
    dark: image.dark.src,
    width: image.light.width,
    height: image.light.height,
  };
}

function slugOf(url: string) {
  return url.split("/").filter(Boolean).at(-1) ?? "";
}

/** The newest component in the changelog that has a docs page of its own. */
function newestComponent(): NavMenuFeature | undefined {
  for (const release of CHANGELOG) {
    const item = release.items.find((link) => componentGroupOf(link.href));
    if (item) {
      return {
        title: pageTitle(item.href, item.label),
        description: pageDescription(item.href),
        href: item.href,
        isNew: isRecent(release.date),
        visual: { kind: "art", art: slugOf(item.href) },
      };
    }
  }
  return undefined;
}

/** The newest block in the changelog. */
function newestBlock(): NavMenuFeature | undefined {
  for (const release of CHANGELOG) {
    for (const item of release.items) {
      const [, section, category, slug] = item.href.split("/");
      if (section !== "blocks" || !(category && slug)) {
        continue;
      }
      const meta = BLOCK_METAS[slug as keyof typeof BLOCK_METAS];
      if (meta) {
        return {
          title: meta.name,
          description: meta.description,
          href: item.href,
          isNew: isRecent(release.date),
          visual: { kind: "art", art: `block-${category}` },
        };
      }
    }
  }
  return undefined;
}

function familyPages(name: string) {
  const family = COMPONENT_GROUPS.find((group) => group.name === name);
  return (family?.slugs ?? []).map((slug) => {
    const url = `${family?.href}/${slug}`;
    return { label: pageTitle(url, slug), href: url };
  });
}

const COMPONENT_TOTAL = COMPONENT_GROUPS.reduce(
  (count, group) => count + group.slugs.length,
  0,
);

const BLOCK_TOTAL = BLOCK_CATEGORIES.reduce(
  (count, category) => count + category.blocks.length,
  0,
);

/** The newest template, which leads the /templates listing. */
const FEATURED_TEMPLATE = SITE_TEMPLATES[0];

function componentsMenu(): NavMenu {
  return {
    id: "components",
    label: "Components",
    match: [...COMPONENT_GROUPS.map((group) => group.href), "/docs/utility"],
    panels: [
      {
        title: "Cortex originals",
        layout: "grid",
        columns: 3,
        links: familyPages("Cortex"),
        footer: {
          label: `Browse all ${COMPONENT_TOTAL} components`,
          href: "/docs/components",
        },
      },
    ],
    feature: newestComponent(),
    strip: {
      title: "Families",
      links: COMPONENT_GROUPS.map((group) => ({
        label: group.name,
        href: group.href,
        meta: String(group.slugs.length),
      })),
    },
  };
}

/** The newest blocks in the changelog, newest first. */
function latestBlocks(count: number): NavMenuLink[] {
  const links: NavMenuLink[] = [];
  for (const release of CHANGELOG) {
    for (const item of release.items) {
      const slug = item.href.split("/")[3];
      const meta = slug ? BLOCK_METAS[slug as keyof typeof BLOCK_METAS] : null;
      if (meta && !links.some((link) => link.href === item.href)) {
        links.push({ label: item.label, href: item.href });
      }
    }
  }
  return links.slice(0, count);
}

function blocksMenu(): NavMenu {
  return {
    id: "blocks",
    label: "Blocks",
    match: ["/blocks"],
    panels: [
      {
        title: "Latest blocks",
        layout: "grid",
        columns: 2,
        links: latestBlocks(10),
        footer: { label: `Browse all ${BLOCK_TOTAL} blocks`, href: "/blocks" },
      },
      {
        title: "By category",
        layout: "list",
        links: BLOCK_CATEGORIES.map((category) => ({
          label: category.name,
          href: `/blocks?category=${category.slug}`,
          meta: String(category.blocks.length),
        })),
      },
    ],
    feature: newestBlock(),
  };
}

function chartsMenu(): NavMenu {
  const composedUrl = "/docs/charts/composed-chart";
  return {
    id: "charts",
    label: "Charts",
    match: ["/charts"],
    panels: [
      {
        title: "Chart types",
        layout: "grid",
        columns: 3,
        links: familyPages("Charts"),
        footer: { label: "Open the chart gallery", href: "/charts/area-chart" },
      },
    ],
    feature: {
      title: pageTitle(composedUrl, "Composed Chart"),
      description: pageDescription(composedUrl),
      href: composedUrl,
      visual: { kind: "art", art: "composed-chart" },
    },
  };
}

function resourcesMenu(): NavMenu {
  return {
    id: "resources",
    label: "Resources",
    match: [
      "/docs/installation",
      "/docs/theming",
      "/docs/integration",
      "/design-systems",
      "/changelog",
    ],
    matchExact: ["/docs"],
    panels: [
      {
        title: "Get started",
        layout: "rich",
        links: [
          {
            label: "Installation",
            href: "/docs/installation",
            description: "Add the registry and your first component.",
            icon: "IconCloudDownload",
          },
          {
            label: "Theming",
            href: "/docs/theming",
            description: "Colors, radius, and dark mode from CSS variables.",
            icon: "IconColorPalette",
          },
          {
            label: "MCP server",
            href: "/docs/integration/mcp",
            description: "Let your AI agent search and install components.",
            icon: "IconAgent",
          },
        ],
      },
      {
        title: "Learn and explore",
        layout: "list",
        links: [
          { label: "Introduction", href: "/docs", icon: "IconBook" },
          {
            label: "Design Systems",
            href: "/design-systems",
            icon: "IconColorSwatch",
          },
          {
            label: "Agent skills",
            href: "/docs/integration/skills",
            icon: "IconMagicWand",
          },
          {
            label: "DESIGN.md",
            href: "/docs/integration/design-md",
            icon: "IconFileText",
          },
          { label: "Changelog", href: "/changelog", icon: "IconClock" },
        ],
      },
    ],
    strip: {
      title: "Elsewhere",
      links: [
        { label: "llms.txt", href: "/llms.txt", icon: "IconCodeLines" },
        {
          label: "X (@SyedMoin)",
          href: "https://x.com/SyedMoin",
          icon: "IconTwitter",
        },
        { label: "Client work", href: "/services", icon: "IconSuitcaseWork" },
      ],
    },
  };
}

/** The header nav on ui.cortexcn.dev. */
export function libraryNavItems(): NavItem[] {
  return [
    { kind: "menu", menu: componentsMenu() },
    { kind: "menu", menu: blocksMenu() },
    { kind: "menu", menu: chartsMenu() },
    { kind: "link", text: "Templates", url: "/templates" },
    { kind: "menu", menu: resourcesMenu() },
  ];
}

export const LIBRARY_CTA: NavCta = {
  label: "Get started",
  href: "/docs/installation",
};

function servicesMenu(): NavMenu {
  return {
    id: "services",
    label: "Services",
    match: ["/services", "/pricing"],
    panels: [
      {
        title: "What I build",
        layout: "grid",
        columns: 3,
        links: SERVICES.map((service) => ({
          label: service.title,
          href: contactHref(
            "custom-work",
            `I'd like a quote for ${service.title.toLowerCase()}.`,
          ),
        })),
        footer: { label: "See every service and price", href: "/services" },
      },
    ],
    strip: {
      title: "Also",
      links: [
        { label: "Pricing", href: "/pricing", icon: "IconDollar" },
        { label: "Work", href: "/work", icon: "IconSuitcaseWork" },
        { label: "Contact", href: "/contact", icon: "IconMailbox" },
      ],
    },
  };
}

function libraryMenu(): NavMenu {
  return {
    id: "library",
    label: "Library",
    match: ["/docs", "/blocks", "/charts", "/templates", "/design-systems"],
    panels: [
      {
        title: "The component library",
        layout: "rich",
        links: [
          {
            label: "Components",
            href: "/docs/components",
            description: `${COMPONENT_TOTAL} components for shadcn/ui, with motion and charts.`,
            icon: "IconBlocks",
          },
          {
            label: "Blocks",
            href: "/blocks",
            description: "Page sections built from them, ready to paste.",
            icon: "IconLayoutDashboard",
          },
          {
            label: "Templates",
            href: "/templates",
            description: "Whole Next.js sites, from one-page to multi-page.",
            icon: "IconWindow",
            isNew: true,
          },
        ],
      },
      {
        title: "Learn",
        layout: "list",
        links: [
          {
            label: "Installation",
            href: "/docs/installation",
            icon: "IconCloudDownload",
          },
          {
            label: "Charts",
            href: "/charts/area-chart",
            icon: "IconLineChart1",
          },
          {
            label: "Design Systems",
            href: "/design-systems",
            icon: "IconColorSwatch",
          },
          { label: "Changelog", href: "/changelog", icon: "IconClock" },
        ],
      },
    ],
    feature: FEATURED_TEMPLATE
      ? {
          title: `${FEATURED_TEMPLATE.name} template`,
          description: FEATURED_TEMPLATE.summary,
          href: `/templates/${FEATURED_TEMPLATE.slug}`,
          visual: screenshot(FEATURED_TEMPLATE.screenshots.card),
        }
      : undefined,
  };
}

/** The header nav on www.cortexcn.dev. */
export function siteNavItems(): NavItem[] {
  return [
    { kind: "menu", menu: servicesMenu() },
    { kind: "menu", menu: libraryMenu() },
    { kind: "link", text: "Work", url: "/work" },
    { kind: "link", text: "Pricing", url: "/pricing" },
    { kind: "link", text: "About", url: "/about" },
  ];
}

export const SITE_CTA: NavCta = { label: "Start a project", href: "/contact" };

export interface RailPromo {
  eyebrow: string;
  feature: NavMenuFeature;
  cta: string;
  note: string;
}

/** The card in the docs' right rail, pointing to the templates. */
export function templatesPromo(): RailPromo | undefined {
  if (!FEATURED_TEMPLATE) {
    return undefined;
  }
  const free = SITE_TEMPLATES.filter((template) => template.price === 0);
  return {
    eyebrow: "Cortexcn Templates",
    feature: {
      title: "Whole sites built with these components",
      description:
        "Next.js templates with every section in place. Swap in your words and ship.",
      href: "/templates",
      visual: screenshot(FEATURED_TEMPLATE.screenshots.card),
    },
    cta: "Browse templates",
    note: `${SITE_TEMPLATES.length} templates, ${free.length} free. Paid ones are a one-time purchase.`,
  };
}
