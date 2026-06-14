import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { CortexcnMark } from "@/components/cortexcn-mark";
import { source } from "@/lib/source";

import { EXCLUDED_PAGES, getStartedOptions } from "./constants";
import { RenderDefaultOptions } from "./render-default-options";
import { NavMain, type NavGroup } from "./nav-main";

type AnyNode = {
  type: string;
  name?: unknown;
  url?: string;
  $id?: string;
  children?: AnyNode[];
};

// Flatten a folder's page descendants (incl. nested folders like components/popover)
// into a single ordered list, skipping excluded pages.
function collectPages(nodes: AnyNode[] = []): { name: string; url: string }[] {
  const out: { name: string; url: string }[] = [];

  for (const node of nodes) {
    if (node.type === "page" && node.url) {
      if (!EXCLUDED_PAGES.includes(node.url)) {
        out.push({ name: String(node.name ?? ""), url: node.url });
      }
    } else if (node.type === "folder") {
      out.push(...collectPages(node.children));
    }
  }

  return out;
}

export function DocsSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const nodes = source.pageTree.children as unknown as AnyNode[];

  const groups: NavGroup[] = nodes
    .filter((node) => node.type === "folder")
    .map((folder) => ({
      id: folder.$id ?? String(folder.name ?? ""),
      name: String(folder.name ?? ""),
      pages: collectPages(folder.children),
    }))
    .filter((group) => group.pages.length > 0);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4 pt-6">
        <Link href="/" aria-label="cortexcn home" className="z-10">
          <CortexcnMark />
        </Link>
      </SidebarHeader>
      <SidebarContent className="docs-sidebar-top-fade pt-2 pb-14 select-none">
        <RenderDefaultOptions options={getStartedOptions} label="Get Started" />
        <NavMain groups={groups} />
      </SidebarContent>
    </Sidebar>
  );
}
