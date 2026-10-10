"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { COMPONENT_GROUPS } from "@/lib/component-families";
import { cn } from "@/lib/utils";
import { ComponentFamilyArt } from "./component-family-art";
import { NavLinkLabel } from "./nav-link-label";

interface HeaderNavLink {
  text: string;
  url: string;
}

/** The nav link that opens the component families menu. */
const COMPONENTS_URL = "/docs/components";

const COMPONENT_TOTAL = COMPONENT_GROUPS.reduce(
  (count, group) => count + group.slugs.length,
  0,
);

const navItemClassName = buttonVariants({ variant: "ghost" });

const menuLinkClassName =
  "outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none";

function isWithin(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 transition-transform group-hover/all:translate-x-0.5 motion-reduce:transition-none"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/** One card per family: a drawing of what it holds, its name, and its size. */
function ComponentFamilies({ pathname }: { pathname: string }) {
  return (
    <>
      <ul className="m-0 grid list-none grid-cols-2 gap-1 p-0 lg:grid-cols-4">
        {COMPONENT_GROUPS.map((group) => {
          const count = group.slugs.length;
          return (
            <li key={group.category}>
              <NavigationMenu.Link
                active={isWithin(pathname, group.href)}
                className={cn(
                  menuLinkClassName,
                  "flex h-full flex-col gap-3 border border-transparent p-2 hover:border-border hover:bg-muted/50 data-active:border-border data-active:bg-muted/50",
                )}
                closeOnClick
                render={<Link href={group.href} />}
              >
                <span className="block overflow-hidden border border-border bg-muted/30">
                  <ComponentFamilyArt category={group.category} />
                </span>
                <span className="flex flex-col gap-1 px-1 pb-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-foreground text-sm">
                      {group.name}
                    </span>
                    <span className="font-mono text-muted-foreground text-xs tabular-nums">
                      {count}
                      <span className="sr-only">
                        {count === 1 ? " page" : " pages"}
                      </span>
                    </span>
                  </span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
                    {group.tagline}
                  </span>
                </span>
              </NavigationMenu.Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-1 flex items-center justify-between gap-4 border-border border-t px-1 pt-2">
        <NavigationMenu.Link
          className={cn(
            menuLinkClassName,
            "group/all inline-flex items-center gap-1.5 px-2 py-1.5 font-medium text-foreground text-sm hover:bg-muted/50",
          )}
          closeOnClick
          render={<Link href={COMPONENTS_URL} />}
        >
          Browse all {COMPONENT_TOTAL} components
          <ArrowIcon />
        </NavigationMenu.Link>
        <NavigationMenu.Link
          className={cn(
            menuLinkClassName,
            "px-2 py-1.5 text-muted-foreground text-sm hover:bg-muted/50 hover:text-foreground",
          )}
          closeOnClick
          render={<Link href="/charts/area-chart" />}
        >
          Chart gallery
        </NavigationMenu.Link>
      </div>
    </>
  );
}

/**
 * The desktop nav of the plain header. The Components link opens a menu of
 * the component families (Components, Cortex, Backgrounds, and Charts), each
 * with its own docs section; the other links go straight to their page.
 */
export function HeaderNav({
  links,
  isActive,
  activeClassName,
}: {
  links: HeaderNavLink[];
  /** Whether a link stands for the section the page is in. */
  isActive: (url: string) => boolean;
  activeClassName: string;
}) {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root className="hidden lg:block">
      <NavigationMenu.List className="m-0 flex list-none items-center gap-1 p-0">
        {links.map((link) => {
          const active = isActive(link.url);
          if (link.url === COMPONENTS_URL) {
            return (
              <NavigationMenu.Item key={link.url} value="components">
                <NavigationMenu.Trigger
                  className={cn(
                    navItemClassName,
                    "gap-1",
                    active && activeClassName,
                  )}
                >
                  <NavLinkLabel text={link.text} url={link.url} />
                  <NavigationMenu.Icon className="flex transition-transform duration-200 data-popup-open:rotate-180 motion-reduce:transition-none">
                    <ChevronIcon />
                  </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="w-[min(calc(100vw-2rem),36rem)] p-2 lg:w-[54rem]">
                  <ComponentFamilies pathname={pathname} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }
          return (
            <NavigationMenu.Item key={link.url}>
              <NavigationMenu.Link
                active={active}
                className={cn(navItemClassName, active && activeClassName)}
                render={<Link href={link.url} />}
              >
                <NavLinkLabel text={link.text} url={link.url} />
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          align="start"
          className="z-60"
          collisionPadding={16}
          sideOffset={8}
        >
          <NavigationMenu.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) border border-border bg-popover text-popover-foreground shadow-lg outline-none transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none">
            <NavigationMenu.Viewport className="relative size-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
