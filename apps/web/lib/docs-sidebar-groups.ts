import type { IconName } from "@cortexcn/icons";
import type * as PageTree from "fumadocs-core/page-tree";
import { BLOCK_CATEGORIES } from "@/blocks/categories";
import { COMPONENT_GROUPS } from "@/lib/component-families";
import { recentlyShippedHrefs } from "@/lib/nav-menus";
import { SITE_TEMPLATES } from "@/lib/site-templates";

/*
 * The docs sidebar as plain data: one collapsible group per section, built
 * on the server from the docs tree, the block categories, and the templates.
 */

export interface SidebarLink {
  name: string;
  url: string;
  isNew?: boolean;
  children?: SidebarLink[];
}

export interface SidebarGroup {
  id: string;
  name: string;
  icon: IconName;
  links: SidebarLink[];
}

const FAMILY_ICONS: Record<string, IconName> = {
  components: "IconBlocks",
  cortex: "IconSparklesSoft",
  backgrounds: "IconImages1",
  charts: "IconLineChart1",
};

function nodeName(node: { name: PageTree.Node["name"] }, fallback: string) {
  return typeof node.name === "string" ? node.name : fallback;
}

/** The pages under a `---Name---` separator, up to the next separator. */
function sectionNodes(tree: PageTree.Root, name: string) {
  const nodes = tree.children;
  const start = nodes.findIndex(
    (node) => node.type === "separator" && node.name === name,
  );
  if (start === -1) {
    return [];
  }
  const section: PageTree.Node[] = [];
  for (const node of nodes.slice(start + 1)) {
    if (node.type === "separator") {
      break;
    }
    section.push(node);
  }
  return section;
}

function toLinks(nodes: PageTree.Node[], isNew: Set<string>): SidebarLink[] {
  return nodes.flatMap((node): SidebarLink[] => {
    if (node.type === "page") {
      return [
        {
          name: nodeName(node, node.url),
          url: node.url,
          isNew: isNew.has(node.url),
        },
      ];
    }
    if (node.type === "folder") {
      const children = toLinks(node.children, isNew);
      const url = node.index?.url ?? children[0]?.url;
      return url ? [{ name: nodeName(node, url), url, children }] : children;
    }
    return [];
  });
}

export function docsSidebarGroups(tree: PageTree.Root): SidebarGroup[] {
  const isNew = new Set(recentlyShippedHrefs());

  const families = COMPONENT_GROUPS.map(
    (family): SidebarGroup => ({
      id: family.category,
      name: family.name,
      icon: FAMILY_ICONS[family.category] ?? "IconBlocks",
      links: [
        { name: "Overview", url: family.href },
        ...toLinks(sectionNodes(tree, family.name), isNew),
      ],
    }),
  );

  return [
    {
      id: "getting-started",
      name: "Getting started",
      icon: "IconCloudDownload",
      links: [
        { name: "Introduction", url: "/docs" },
        { name: "Installation", url: "/docs/installation" },
        { name: "Theming", url: "/docs/theming" },
        { name: "Changelog", url: "/changelog" },
      ],
    },
    {
      id: "integration",
      name: "Integration",
      icon: "IconAgent",
      links: toLinks(sectionNodes(tree, "Integration"), isNew),
    },
    ...families,
    {
      id: "chart-utilities",
      name: "Chart utilities",
      icon: "IconSettingsKnob",
      links: toLinks(sectionNodes(tree, "Chart Utilities"), isNew),
    },
    {
      id: "blocks",
      name: "Blocks",
      icon: "IconLayoutDashboard",
      links: [
        { name: "All blocks", url: "/blocks" },
        ...BLOCK_CATEGORIES.map((category) => ({
          name: category.name,
          url: `/blocks?category=${category.slug}`,
        })),
      ],
    },
    {
      id: "templates",
      name: "Templates",
      icon: "IconWindow",
      links: SITE_TEMPLATES.map((template) => ({
        name: template.name,
        url: `/templates/${template.slug}`,
        isNew: isNew.has(`/templates/${template.slug}`),
      })),
    },
  ];
}
