import type { ReactNode } from "react";
import type { SidebarGroup } from "@/lib/docs-sidebar-groups";
import { Sidebar } from "./sidebar";
import { SiteFooter } from "./site-footer";

interface DocsLayoutProps {
  children: ReactNode;
  /** The sidebar's sections, from `docsSidebarGroups()`. */
  groups: SidebarGroup[];
}

/** Docs pages: the sidebar on the left, the page, and room for the right rail. */
export function DocsLayout({ children, groups }: DocsLayoutProps) {
  return (
    <div className="min-h-full w-full">
      <Sidebar groups={groups} />
      <main className="w-full lg:pl-72 xl:pr-72">
        {children}
        <SiteFooter className="lg:pl-72 xl:pr-72" />
      </main>
    </div>
  );
}
