import type * as PageTree from "fumadocs-core/page-tree";

import {
  COMPONENT_GROUPS,
  type ComponentGroup,
} from "@/lib/component-families";
import { source } from "@/lib/source";

/**
 * Pages listed under a sidebar separator, up to the next separator. Each
 * family's folder is extracted into the root sidebar, so its `---Name---`
 * separator sits at the top level of the page tree.
 */
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
