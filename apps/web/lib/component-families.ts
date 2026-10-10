import backgroundsMeta from "@/content/docs/backgrounds/meta.json";
import chartsMeta from "@/content/docs/charts/meta.json";
import componentsMeta from "@/content/docs/components/meta.json";
import cortexMeta from "@/content/docs/cortex/meta.json";

/** The page slugs a docs folder lists in the sidebar, without separators. */
function sidebarSlugs(meta: { pages: string[] }) {
  return meta.pages.filter((page) => !page.startsWith("---"));
}

/**
 * The component families. Each one is a docs folder, content/docs/<category>,
 * with an overview page at `href` and a meta.json that opens with a
 * `---Name---` sidebar separator. `category` is also the value used in the
 * registry's `categories` field, and `tagline` is the line on its card in the
 * header's Components menu. Safe to import from client components.
 */
export const COMPONENT_GROUPS = [
  {
    name: "Components",
    category: "components",
    href: "/docs/components",
    tagline: "shadcn/ui building blocks: buttons, dialogs, menus, and forms.",
    description:
      "Everyday building blocks from shadcn/ui, from buttons and dialogs to menus, forms, and sidebars.",
    slugs: sidebarSlugs(componentsMeta),
  },
  {
    name: "Cortex",
    category: "cortex",
    href: "/docs/cortex",
    tagline: "Cortexcn originals for motion, navigation, and theming.",
    description:
      "Cortexcn originals you won't find in shadcn/ui: motion, navigation, and theming.",
    slugs: sidebarSlugs(cortexMeta),
  },
  {
    name: "Backgrounds",
    category: "backgrounds",
    href: "/docs/backgrounds",
    tagline: "Animated WebGL backgrounds for heroes and sections.",
    description:
      "Animated full-bleed backgrounds for heroes and sections, drawn with WebGL.",
    slugs: sidebarSlugs(backgroundsMeta),
  },
  {
    name: "Charts",
    category: "charts",
    href: "/docs/charts",
    tagline: "Composable charts with animation, tooltips, and themes.",
    description: "Composable charts with animation, tooltips, and themes.",
    slugs: sidebarSlugs(chartsMeta),
  },
] as const;

export type ComponentGroup = (typeof COMPONENT_GROUPS)[number];

/** The docs page for a component, background, or chart, found by its slug. */
export function componentDocsUrl(slug: string) {
  const group =
    COMPONENT_GROUPS.find((family) => family.slugs.includes(slug)) ??
    COMPONENT_GROUPS[0];
  return `${group.href}/${slug}`;
}
