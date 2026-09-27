import type * as PageTree from "fumadocs-core/page-tree";

import { source } from "@/lib/source";

/**
 * The component families. Each `name` must match a `---Name---` separator in
 * content/docs/components/meta.json, and `category` is the value used in the
 * registry's `categories` field.
 */
export const COMPONENT_GROUPS = [
  {
    name: "Neurons",
    category: "neurons",
    description:
      "Everyday building blocks, adapted from shadcn/ui and styled to match.",
  },
  {
    name: "Cortex",
    category: "cortex",
    description:
      "Cortexcn originals you won't find in shadcn/ui: motion, navigation, and theming.",
  },
  {
    name: "Charts",
    category: "charts",
    description: "Composable charts with animation, tooltips, and themes.",
  },
] as const;

export type ComponentGroup = (typeof COMPONENT_GROUPS)[number];

/** Pages listed under a sidebar separator, up to the next separator. */
export function componentGroupPages(name: string): PageTree.Item[] {
  const nodes = source.pageTree.children;
  const start = nodes.findIndex(
    (node) => node.type === "separator" && node.name === name,
  );
  if (start === -1) {
    return [];
  }

  const pages: PageTree.Item[] = [];
  for (const node of nodes.slice(start + 1)) {
    if (node.type === "separator") {
      break;
    }
    if (node.type === "page") {
      pages.push(node);
    }
  }
  return pages;
}

/** The family a docs page belongs to, if it is a component page. */
export function componentGroupOf(url: string): ComponentGroup | undefined {
  return COMPONENT_GROUPS.find((group) =>
    componentGroupPages(group.name).some((page) => page.url === url),
  );
}
