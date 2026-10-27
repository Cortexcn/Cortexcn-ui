"use client";

import { NavigationMenu } from "@base-ui/react/navigation-menu";
import { Icon, type IconName } from "@cortexcn/icons";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type {
  NavItem,
  NavMenu,
  NavMenuFeature,
  NavMenuLink,
  NavMenuPanel,
} from "@/lib/nav-menus";
import { cn } from "@/lib/utils";
import { ComponentArt } from "./component-art";
import { NavLinkLabel, NewMark } from "./nav-link-label";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none";

const navItemClassName = cn(
  focusRing,
  "inline-flex h-9 items-center gap-1 rounded-shell-sm px-3 font-medium text-foreground/70 text-sm transition-colors hover:bg-muted/70 hover:text-foreground data-popup-open:bg-muted/70 data-popup-open:text-foreground",
);

const activeNavItemClassName = "text-foreground";

/** Whether the page sits inside one of the sections a menu stands for. */
export function isMenuActive(menu: NavMenu, pathname: string) {
  return (
    menu.matchExact?.includes(pathname) === true ||
    menu.match.some(
      (href) => pathname === href || pathname.startsWith(`${href}/`),
    )
  );
}

function isExternal(href: string) {
  return href.startsWith("http");
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

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "size-3.5 transition-transform group-hover/arrow:translate-x-0.5 motion-reduce:transition-none",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

/** A link inside a menu, which closes the menu when it is followed. */
function MenuLink({
  link,
  className,
  children,
}: {
  link: NavMenuLink;
  className?: string;
  children: ReactNode;
}) {
  const external = isExternal(link.href);
  return (
    <NavigationMenu.Link
      className={cn(focusRing, className)}
      closeOnClick
      render={
        external ? (
          (props) => (
            <a {...props} href={link.href} rel="noopener" target="_blank">
              {props.children}
            </a>
          )
        ) : (
          <Link href={link.href} />
        )
      }
    >
      {children}
    </NavigationMenu.Link>
  );
}

function IconTile({ name, size }: { name: IconName; size: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-shell-sm border border-border bg-background text-foreground/80 shadow-xs",
        size === "md" ? "size-9" : "size-7",
      )}
    >
      <Icon className={size === "md" ? "size-4.5" : "size-4"} name={name} />
    </span>
  );
}

const GRID_COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
} as const;

function Panel({ panel }: { panel: NavMenuPanel }) {
  return (
    <div className="flex min-w-0 flex-col rounded-shell-lg border border-border bg-popover p-4 shadow-xs">
      <p className="m-0 mb-2 px-1 text-muted-foreground text-xs">
        {panel.title}
      </p>
      {panel.layout === "grid" && (
        <ul
          className={cn(
            "m-0 grid list-none gap-x-6 p-0",
            GRID_COLUMNS[panel.columns ?? 3],
          )}
        >
          {panel.links.map((link) => (
            <li key={link.href}>
              <MenuLink
                className="flex items-baseline gap-2 whitespace-nowrap rounded-shell-sm px-1 py-1.5 text-foreground/85 text-sm transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
                link={link}
              >
                {link.label}
                {link.meta ? (
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {link.meta}
                  </span>
                ) : null}
              </MenuLink>
            </li>
          ))}
        </ul>
      )}
      {panel.layout === "rich" && (
        <ul className="m-0 flex w-80 list-none flex-col gap-0.5 p-0">
          {panel.links.map((link) => (
            <li key={link.href}>
              <MenuLink
                className="flex items-start gap-3 rounded-shell p-2 transition-colors hover:bg-muted/70"
                link={link}
              >
                {link.icon ? <IconTile name={link.icon} size="md" /> : null}
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-1 font-medium text-foreground text-sm">
                    {link.label}
                    {link.isNew ? <NewMark /> : null}
                  </span>
                  {link.description ? (
                    <span className="text-muted-foreground text-xs leading-relaxed">
                      {link.description}
                    </span>
                  ) : null}
                </span>
              </MenuLink>
            </li>
          ))}
        </ul>
      )}
      {panel.layout === "list" && (
        <ul className="m-0 flex w-48 list-none flex-col gap-0.5 p-0">
          {panel.links.map((link) => (
            <li key={link.href}>
              <MenuLink
                className="flex items-center gap-2.5 rounded-shell-sm px-1 py-1 text-foreground/85 text-sm transition-colors hover:bg-muted/70 hover:text-foreground"
                link={link}
              >
                {link.icon ? <IconTile name={link.icon} size="sm" /> : null}
                {link.label}
                {link.meta ? (
                  <span className="ml-auto font-mono text-[11px] text-muted-foreground tabular-nums">
                    {link.meta}
                  </span>
                ) : null}
              </MenuLink>
            </li>
          ))}
        </ul>
      )}
      {panel.footer ? (
        <MenuLink
          className="group/arrow mt-auto inline-flex w-fit items-center gap-1.5 rounded-shell-sm px-1 pt-4 font-medium text-foreground text-sm"
          link={panel.footer}
        >
          {panel.footer.label}
          <ArrowIcon />
        </MenuLink>
      ) : null}
    </div>
  );
}

/** The picture on a feature card: a line drawing, or a screenshot per theme. */
export function FeatureVisual({ feature }: { feature: NavMenuFeature }) {
  const { visual } = feature;
  if (visual.kind === "art") {
    return (
      <ComponentArt
        className="transition-transform duration-300 group-hover/feature:scale-[1.03] motion-reduce:transition-none"
        name={visual.art}
      />
    );
  }
  const imageClassName =
    "block h-auto w-full transition-transform duration-300 group-hover/feature:scale-[1.03] motion-reduce:transition-none";
  return (
    <>
      <Image
        alt=""
        className={cn(imageClassName, "dark:hidden")}
        height={visual.height}
        sizes="240px"
        src={visual.light}
        width={visual.width}
      />
      <Image
        alt=""
        className={cn(imageClassName, "hidden dark:block")}
        height={visual.height}
        sizes="240px"
        src={visual.dark}
        width={visual.width}
      />
    </>
  );
}

function FeatureCard({ feature }: { feature: NavMenuFeature }) {
  return (
    <MenuLink
      className="group/feature flex w-60 shrink-0 flex-col gap-2.5 rounded-shell-lg p-1.5 transition-colors hover:bg-popover"
      link={{ label: feature.title, href: feature.href }}
    >
      <span className="block overflow-hidden rounded-shell border border-border bg-card shadow-xs">
        <FeatureVisual feature={feature} />
      </span>
      <span className="flex flex-col gap-1 px-1 pb-1">
        <span className="flex items-center gap-1.5 font-medium text-foreground text-sm">
          {feature.title}
          {feature.isNew ? <NewMark /> : null}
        </span>
        <span className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">
          {feature.description}
        </span>
      </span>
    </MenuLink>
  );
}

/** One menu's contents: its panels, the feature card, and the bottom strip. */
function MenuContents({ menu }: { menu: NavMenu }) {
  return (
    <div className="flex flex-col gap-1.5 p-1.5">
      <div className="flex gap-1.5">
        {menu.panels.map((panel) => (
          <Panel key={panel.title} panel={panel} />
        ))}
        {menu.feature ? <FeatureCard feature={menu.feature} /> : null}
      </div>
      {menu.strip ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-3 pt-1 pb-1.5">
          <span className="text-muted-foreground text-xs">
            {menu.strip.title}
          </span>
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-1 p-0">
            {menu.strip.links.map((link) => (
              <li key={link.href}>
                <MenuLink
                  className="inline-flex items-center gap-1.5 rounded-shell-sm py-0.5 text-foreground/80 text-xs transition-colors hover:text-foreground"
                  link={link}
                >
                  {link.icon ? (
                    <Icon className="size-3.5" name={link.icon} />
                  ) : null}
                  {link.label}
                  {link.meta ? (
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {link.meta}
                    </span>
                  ) : null}
                </MenuLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The desktop nav: plain links, and menus that open a panel of links with a
 * featured card on the right. Hover or focus a trigger to open its menu.
 */
export function HeaderNav({
  items,
  pathname,
  isLinkActive,
  className,
}: {
  items: NavItem[];
  pathname: string;
  /** Whether a plain link stands for the section the page is in. */
  isLinkActive: (url: string) => boolean;
  className?: string;
}) {
  return (
    <NavigationMenu.Root className={cn("hidden lg:block", className)}>
      <NavigationMenu.List className="m-0 flex list-none items-center gap-0.5 p-0">
        {items.map((item) => {
          if (item.kind === "menu") {
            const { menu } = item;
            return (
              <NavigationMenu.Item key={menu.id} value={menu.id}>
                <NavigationMenu.Trigger
                  className={cn(
                    navItemClassName,
                    isMenuActive(menu, pathname) && activeNavItemClassName,
                  )}
                >
                  {menu.label}
                  <NavigationMenu.Icon className="flex text-muted-foreground transition-transform duration-200 data-popup-open:rotate-180 motion-reduce:transition-none">
                    <ChevronIcon />
                  </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <MenuContents menu={menu} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            );
          }
          const active = isLinkActive(item.url);
          return (
            <NavigationMenu.Item key={item.url}>
              <NavigationMenu.Link
                active={active}
                className={cn(
                  navItemClassName,
                  active && activeNavItemClassName,
                )}
                render={<Link href={item.url} />}
              >
                <NavLinkLabel text={item.text} url={item.url} />
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
          sideOffset={10}
        >
          <NavigationMenu.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-shell-xl border border-border bg-muted text-popover-foreground shadow-2xl outline-none transition-[opacity,scale,width,height] duration-200 ease-out data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-popover">
            <NavigationMenu.Viewport className="relative size-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
