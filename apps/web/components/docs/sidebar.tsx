"use client";

import { Icon } from "@cortexcn/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DocsScrollArea } from "@/components/docs/docs-scroll-area";
import type { SidebarGroup, SidebarLink } from "@/lib/docs-sidebar-groups";
import { cn } from "@/lib/utils";
import { NewMark } from "./nav-link-label";

function linkPath(url: string) {
  return url.split("?")[0] ?? url;
}

function containsPage(links: SidebarLink[], pathname: string): boolean {
  return links.some(
    (link) =>
      linkPath(link.url) === pathname ||
      (link.children ? containsPage(link.children, pathname) : false),
  );
}

/** The groups that start open: the one holding this page, or Getting started. */
function initialOpen(groups: SidebarGroup[], pathname: string) {
  const current = groups.find((group) => containsPage(group.links, pathname));
  return new Set([current?.id ?? "getting-started"]);
}

function SidebarLinks({
  links,
  pathname,
  depth = 0,
}: {
  links: SidebarLink[];
  pathname: string;
  depth?: number;
}) {
  return (
    <ul
      className={cn(
        "m-0 list-none p-0",
        depth === 0 ? "ml-[1.125rem] border-border border-l" : "ml-3",
      )}
    >
      {links.map((link) => {
        const active = !link.url.includes("?") && link.url === pathname;
        return (
          <li key={link.url}>
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "-ml-px flex items-center gap-1.5 border-l py-[0.3125rem] pr-2 pl-4 text-[13.5px] no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                active
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
              href={link.url}
            >
              <span className="truncate">{link.name}</span>
              {link.isNew ? <NewMark /> : null}
            </Link>
            {link.children && link.children.length > 0 ? (
              <SidebarLinks
                depth={depth + 1}
                links={link.children}
                pathname={pathname}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function SidebarGroupItem({
  group,
  open,
  pathname,
  onToggle,
}: {
  group: SidebarGroup;
  open: boolean;
  pathname: string;
  onToggle: () => void;
}) {
  const panelId = `sidebar-group-${group.id}`;
  return (
    <li className="list-none">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-shell-sm px-2 py-1.5 text-left font-medium text-foreground/90 text-sm outline-none transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={onToggle}
        type="button"
      >
        <Icon
          className="size-4 shrink-0 text-muted-foreground"
          name={group.icon}
        />
        <span className="flex-1 truncate">{group.name}</span>
        <Icon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
            open ? "rotate-0" : "-rotate-90",
          )}
          name="IconChevronDownSmall"
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
        id={panelId}
        inert={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-1 pb-3">
            <SidebarLinks links={group.links} pathname={pathname} />
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * The docs sidebar: one collapsible group per section, with the group that
 * holds the current page open. It scrolls on its own, beside the page.
 */
export function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => initialOpen(groups, pathname));
  const navRef = useRef<HTMLElement>(null);

  // Opening a page in a closed group opens that group too.
  useEffect(() => {
    const current = groups.find((group) => containsPage(group.links, pathname));
    if (current) {
      setOpen((previous) =>
        previous.has(current.id)
          ? previous
          : new Set([...previous, current.id]),
      );
    }
  }, [groups, pathname]);

  // Bring the current page into view in a long group.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on navigation.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      navRef.current
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const toggle = (id: string) => {
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <aside className="fixed top-(--site-header-height) left-0 hidden h-[calc(100vh-var(--site-header-height))] w-72 border-border border-r bg-background lg:block">
      <DocsScrollArea className="h-full" showEdgeGradient>
        <nav aria-label="Docs" className="px-4 pt-5 pb-10" ref={navRef}>
          <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
            {groups.map((group) => (
              <SidebarGroupItem
                group={group}
                key={group.id}
                onToggle={() => toggle(group.id)}
                open={open.has(group.id)}
                pathname={pathname}
              />
            ))}
          </ul>
        </nav>
      </DocsScrollArea>
    </aside>
  );
}
