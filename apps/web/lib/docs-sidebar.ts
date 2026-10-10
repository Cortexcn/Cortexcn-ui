import type * as PageTree from "fumadocs-core/page-tree";

import {
  COMPONENT_GROUPS,
  type ComponentGroup,
} from "@/lib/component-families";

/** The sidebar section for the chart parts, which belongs with Charts. */
const CHART_UTILITIES = "Chart Utilities";
const CHART_UTILITIES_HREF = "/docs/utility";

/** Heading for the family links on docs pages outside every family. */
const FAMILIES_HEADING = "Component families";

function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The component family a docs page belongs to. Chart utilities count as Charts. */
export function familyForPath(pathname: string): ComponentGroup | undefined {
  if (isWithin(pathname, CHART_UTILITIES_HREF)) {
    return COMPONENT_GROUPS.find((group) => group.category === "charts");
  }
  return COMPONENT_GROUPS.find((group) => isWithin(pathname, group.href));
}

interface SidebarSection {
  /** The separator's name; the nodes before the first separator have none. */
  name?: string;
  nodes: PageTree.Node[];
}

/** Splits the top level of the tree at each `---Name---` separator. */
function sidebarSections(nodes: PageTree.Node[]): SidebarSection[] {
  const sections: SidebarSection[] = [{ nodes: [] }];
  for (const node of nodes) {
    if (node.type === "separator") {
      sections.push({
        name: typeof node.name === "string" ? node.name : undefined,
        nodes: [node],
      });
    } else {
      sections.at(-1)?.nodes.push(node);
    }
  }
  return sections;
}

/**
 * The part of the docs tree a page's sidebar shows. Each component family is
 * its own section of the docs, so its pages list only that family (Charts
 * also keeps Chart Utilities). Every other docs page lists the general docs
 * and one link per family instead of every component.
 */
export function sidebarTreeFor(
  tree: PageTree.Root,
  pathname: string,
): PageTree.Root {
  const sections = sidebarSections(tree.children);
  const family = familyForPath(pathname);

  if (family) {
    const shown = new Set<string>([family.name]);
    if (family.category === "charts") {
      shown.add(CHART_UTILITIES);
    }
    return {
      ...tree,
      children: sections
        .filter((section) => section.name && shown.has(section.name))
        .flatMap((section) => section.nodes),
    };
  }

  const familySections = new Set<string>([
    ...COMPONENT_GROUPS.map((group) => group.name),
    CHART_UTILITIES,
  ]);
  return {
    ...tree,
    children: [
      ...sections
        .filter(
          (section) => !(section.name && familySections.has(section.name)),
        )
        .flatMap((section) => section.nodes),
      { $id: "component-families", type: "separator", name: FAMILIES_HEADING },
      ...COMPONENT_GROUPS.map(
        (group): PageTree.Item => ({
          $id: `component-family-${group.category}`,
          type: "page",
          name: group.name,
          url: group.href,
        }),
      ),
    ],
  };
}
