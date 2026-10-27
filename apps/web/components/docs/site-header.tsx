"use client";

import { Icon } from "@cortexcn/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { UserMenu } from "@/components/auth/user-menu";
import { ModeToggle } from "@/components/mode-toggle";
import {
  COMPONENT_GROUPS,
  type ComponentGroup,
} from "@/lib/component-families";
import { familyForPath } from "@/lib/docs-sidebar";
import type { NavCta, NavItem, NavMenu } from "@/lib/nav-menus";
import { isLibraryPath } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import { CortexcnLogo } from "../icons/cortexcn";
import { Button } from "../ui/button";
import { DocsSearchTrigger } from "./docs-search-trigger";
import { HeaderNav, isMenuActive } from "./header-nav";
import { NavLinkLabel, NewMark } from "./nav-link-label";

interface SiteHeaderProps {
  /** Nav for the services site on www.cortexcn.dev. */
  items?: NavItem[];
  cta?: NavCta;
  /**
   * Nav for the component library pages (docs, blocks, and charts), which
   * belong to ui.cortexcn.dev rather than the services site.
   */
  libraryItems?: NavItem[];
  libraryCta?: NavCta;
  /**
   * Theme scope. By default the landing-kit pages take the landing theme and
   * every other page the plain one; pass it where the URL alone cannot tell,
   * such as a page served at `/` through a rewrite.
   */
  variant?: "landing" | "plain";
}

/** The shadcn/ui building blocks, in the order of the docs sidebar. */
const baseComponents = [
  { text: "Accordion", url: "/docs/components/accordion" },
  { text: "Alert", url: "/docs/components/alert" },
  { text: "Alert Dialog", url: "/docs/components/alert-dialog" },
  { text: "Aspect Ratio", url: "/docs/components/aspect-ratio" },
  { text: "Avatar", url: "/docs/components/avatar" },
  { text: "Badge", url: "/docs/components/badge" },
  { text: "Breadcrumb", url: "/docs/components/breadcrumb" },
  { text: "Button", url: "/docs/components/button" },
  { text: "Button Group", url: "/docs/components/button-group" },
  { text: "Calendar", url: "/docs/components/calendar" },
  { text: "Card", url: "/docs/components/card" },
  { text: "Carousel", url: "/docs/components/carousel" },
  { text: "Checkbox", url: "/docs/components/checkbox" },
  { text: "Collapsible", url: "/docs/components/collapsible" },
  { text: "Combobox", url: "/docs/components/combobox" },
  { text: "Command", url: "/docs/components/command" },
  { text: "Context Menu", url: "/docs/components/context-menu" },
  { text: "Dialog", url: "/docs/components/dialog" },
  { text: "Drawer", url: "/docs/components/drawer" },
  { text: "Dropdown Menu", url: "/docs/components/dropdown-menu" },
  { text: "Empty", url: "/docs/components/empty" },
  { text: "Field", url: "/docs/components/field" },
  { text: "Hover Card", url: "/docs/components/hover-card" },
  { text: "Input", url: "/docs/components/input" },
  { text: "Input Group", url: "/docs/components/input-group" },
  { text: "Input OTP", url: "/docs/components/input-otp" },
  { text: "Item", url: "/docs/components/item" },
  { text: "Kbd", url: "/docs/components/kbd" },
  { text: "Label", url: "/docs/components/label" },
  { text: "Menubar", url: "/docs/components/menubar" },
  { text: "Native Select", url: "/docs/components/native-select" },
  { text: "Navigation Menu", url: "/docs/components/navigation-menu" },
  { text: "Pagination", url: "/docs/components/pagination" },
  { text: "Popover", url: "/docs/components/popover" },
  { text: "Progress", url: "/docs/components/progress" },
  { text: "Radio Group", url: "/docs/components/radio-group" },
  { text: "Resizable", url: "/docs/components/resizable" },
  { text: "Scroll Area", url: "/docs/components/scroll-area" },
  { text: "Select", url: "/docs/components/select" },
  { text: "Separator", url: "/docs/components/separator" },
  { text: "Sheet", url: "/docs/components/sheet" },
  { text: "Sidebar", url: "/docs/components/sidebar" },
  { text: "Skeleton", url: "/docs/components/skeleton" },
  { text: "Slider", url: "/docs/components/slider" },
  { text: "Sonner", url: "/docs/components/sonner" },
  { text: "Spinner", url: "/docs/components/spinner" },
  { text: "Switch", url: "/docs/components/switch" },
  { text: "Table", url: "/docs/components/table" },
  { text: "Tabs", url: "/docs/components/tabs" },
  { text: "Textarea", url: "/docs/components/textarea" },
  { text: "Toggle", url: "/docs/components/toggle" },
  { text: "Toggle Group", url: "/docs/components/toggle-group" },
  { text: "Tooltip", url: "/docs/components/tooltip" },
];

const cortexComponents = [
  { text: "Command Search", url: "/docs/cortex/command-search" },
  { text: "Fan-Out Diagram", url: "/docs/cortex/fan-out-diagram" },
  { text: "FAQ Tabs Card", url: "/docs/cortex/faq-tabs-card" },
  { text: "Gooey Nav", url: "/docs/cortex/gooey-nav" },
  { text: "Lanyard 3D", url: "/docs/cortex/lanyard-3d" },
  { text: "Lanyard Badge", url: "/docs/cortex/lanyard-badge" },
  { text: "Line Nav", url: "/docs/cortex/line-nav" },
  { text: "Logos Carousel", url: "/docs/cortex/logos-carousel" },
  { text: "Marquee", url: "/docs/cortex/marquee" },
  { text: "Number Ticker", url: "/docs/cortex/number-ticker" },
  {
    text: "Perspective Marquee",
    url: "/docs/cortex/perspective-marquee",
  },
  { text: "Sphere Menu", url: "/docs/cortex/sphere-menu" },
  { text: "Theme Toggle Effect", url: "/docs/cortex/theme-toggle-effect" },
  { text: "Work Experience", url: "/docs/cortex/work-experience" },
];

const backgroundComponents = [
  { text: "Light Speed", url: "/docs/backgrounds/light-speed" },
];

const chartComponents = [
  { text: "Area Chart", url: "/docs/charts/area-chart" },
  { text: "Bar Chart", url: "/docs/charts/bar-chart" },
  { text: "Candlestick Chart", url: "/docs/charts/candlestick-chart" },
  { text: "Choropleth Chart", url: "/docs/charts/choropleth-chart" },
  { text: "Composed Chart", url: "/docs/charts/composed-chart" },
  { text: "Funnel Chart", url: "/docs/charts/funnel-chart" },
  { text: "Gauge", url: "/docs/charts/gauge-chart" },
  { text: "Heatmap Chart", url: "/docs/charts/heatmap-chart" },
  { text: "Line Chart", url: "/docs/charts/line-chart" },
  { text: "Profit/Loss Line", url: "/docs/charts/profit-loss-line" },
  { text: "Live Line Chart", url: "/docs/charts/live-line-chart" },
  { text: "Pie Chart", url: "/docs/charts/pie-chart" },
  { text: "Radar Chart", url: "/docs/charts/radar-chart" },
  { text: "Ring Chart", url: "/docs/charts/ring-chart" },
  { text: "Scatter Chart", url: "/docs/charts/scatter-chart" },
  { text: "Sankey Chart", url: "/docs/charts/sankey-chart" },
  { text: "Sunburst Chart", url: "/docs/charts/sunburst-chart" },
];

/** The chart utilities, with the two axis pages listed inline. */
const chartUtilities = [
  { text: "Legend", url: "/docs/utility/legend" },
  { text: "Grid", url: "/docs/utility/grid" },
  { text: "Background", url: "/docs/utility/background" },
  { text: "Reference Area", url: "/docs/utility/reference-area" },
  { text: "Projection Line", url: "/docs/utility/projection-line" },
  { text: "Tooltip", url: "/docs/utility/tooltip" },
  { text: "Brush", url: "/docs/utility/brush" },
  { text: "X Axis", url: "/docs/utility/axis/x-axis" },
  { text: "Y Axis", url: "/docs/utility/axis/y-axis" },
  { text: "Custom Indicator", url: "/docs/utility/custom-indicator" },
  { text: "useChart", url: "/docs/utility/use-chart" },
];

/** A mobile menu section: a heading, linking to its overview when it has one, then its pages. */
interface MobileMenuSection {
  title: string;
  href?: string;
  items: { text: string; url: string }[];
}

/** What the mobile menu lists inside each family: that family only, like the docs sidebar. */
const FAMILY_SECTIONS: Record<ComponentGroup["category"], MobileMenuSection[]> =
  {
    components: [
      { title: "Components", href: "/docs/components", items: baseComponents },
    ],
    cortex: [
      { title: "Cortex", href: "/docs/cortex", items: cortexComponents },
    ],
    backgrounds: [
      {
        title: "Backgrounds",
        href: "/docs/backgrounds",
        items: backgroundComponents,
      },
    ],
    charts: [
      { title: "Charts", href: "/docs/charts", items: chartComponents },
      { title: "Chart Utilities", items: chartUtilities },
    ],
  };

/** Outside the families, one link per family instead of every component. */
const FAMILY_LINKS: MobileMenuSection = {
  title: "Component families",
  items: COMPONENT_GROUPS.map((group) => ({
    text: group.name,
    url: group.href,
  })),
};

/** Inside a component family, its pages; elsewhere in the docs, the families. */
function mobileMenuSections(pathname: string): MobileMenuSection[] {
  const family = familyForPath(pathname);
  if (family) {
    return FAMILY_SECTIONS[family.category];
  }
  const inDocs = pathname === "/docs" || pathname.startsWith("/docs/");
  return inDocs ? [FAMILY_LINKS] : [];
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        className="origin-center transition-all duration-200"
        d={open ? "M18 6L6 18" : "M4 6h16"}
      />
      <path
        className="origin-center transition-all duration-200"
        d="M4 12h16"
        style={{ opacity: open ? 0 : 1 }}
      />
      <path
        className="origin-center transition-all duration-200"
        d={open ? "M6 6l12 12" : "M4 18h16"}
      />
    </svg>
  );
}

/** Pages built from the landing kit, which take the landing theme. */
const LANDING_PATHS = new Set([
  "/",
  "/about",
  "/contact",
  "/pricing",
  "/privacy",
  "/refunds",
  "/services",
  "/terms",
  "/work",
]);

function isLandingPath(pathname: string) {
  return LANDING_PATHS.has(pathname) || pathname.startsWith("/work/");
}

/** Search covers the docs, so it only shows in the header on the docs and chart pages. */
function hasDocsSearch(pathname: string) {
  return ["/docs", "/charts"].some(
    (section) => pathname === section || pathname.startsWith(`${section}/`),
  );
}

/** Whether a plain nav link stands for the section the page is in. */
function isNavLinkActive(url: string, pathname: string) {
  const section = `/${url.split("/")[1] ?? ""}`;
  return pathname === section || pathname.startsWith(`${section}/`);
}

const mobileLinkClassName =
  "flex h-10 items-center rounded-shell-sm px-3 text-foreground/80 text-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-foreground";

/** A mobile menu section heading, which links to that section's overview. */
const sectionHeadingClassName =
  "mb-1 block px-3 font-medium text-muted-foreground text-xs outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline aria-[current=page]:text-foreground";

/** Every link a menu holds, for the mobile menu, which lists them in place. */
function menuLinks(menu: NavMenu) {
  const links = menu.panels.flatMap((panel) => [
    ...panel.links,
    ...(panel.footer ? [panel.footer] : []),
  ]);
  return [...links, ...(menu.strip?.links ?? [])].filter(
    (link, index, all) =>
      all.findIndex((other) => other.href === link.href) === index,
  );
}

function MobileMenuGroup({
  menu,
  pathname,
  onClose,
}: {
  menu: NavMenu;
  pathname: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(() => isMenuActive(menu, pathname));
  const panelId = `mobile-menu-${menu.id}`;
  return (
    <div>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={cn(
          mobileLinkClassName,
          "w-full justify-between font-medium text-foreground",
        )}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {menu.label}
        <Icon
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
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
        <ul className="m-0 ml-4 min-h-0 list-none overflow-hidden border-border border-l p-0 pl-2">
          {menuLinks(menu).map((link) => (
            <li key={link.href}>
              <Link
                aria-current={pathname === link.href ? "page" : undefined}
                className={cn(mobileLinkClassName, "h-9 gap-1.5")}
                href={link.href}
                onClick={onClose}
              >
                {link.label}
                {link.isNew ? <NewMark /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface MobileMenuProps {
  items: NavItem[];
  cta?: NavCta;
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ items, cta, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const sections = mobileMenuSections(pathname);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-2 top-[calc(var(--site-header-height)+0.5rem)] bottom-2 z-50 flex flex-col overflow-hidden rounded-shell-xl border border-border bg-popover shadow-2xl transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        inert={!isOpen}
      >
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {items.map((item) =>
            item.kind === "menu" ? (
              <MobileMenuGroup
                key={item.menu.id}
                menu={item.menu}
                onClose={onClose}
                pathname={pathname}
              />
            ) : (
              <Link
                aria-current={
                  isNavLinkActive(item.url, pathname) ? "page" : undefined
                }
                className={cn(mobileLinkClassName, "font-medium")}
                href={item.url}
                key={item.url}
                onClick={onClose}
              >
                <NavLinkLabel text={item.text} url={item.url} />
              </Link>
            ),
          )}

          {sections.map((section) => (
            <div
              className="mt-3 border-border border-t pt-3"
              key={section.title}
            >
              {section.href ? (
                <Link
                  aria-current={pathname === section.href ? "page" : undefined}
                  className={sectionHeadingClassName}
                  href={section.href}
                  onClick={onClose}
                >
                  {section.title}
                </Link>
              ) : (
                <span className={sectionHeadingClassName}>{section.title}</span>
              )}
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
                {section.items.map((link) => (
                  <li key={link.url}>
                    <Link
                      aria-current={pathname === link.url ? "page" : undefined}
                      className={cn(mobileLinkClassName, "h-9")}
                      href={link.url}
                      onClick={onClose}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        {cta ? (
          <div className="border-border border-t p-3">
            <Link
              className="flex h-10 items-center justify-center rounded-shell-sm bg-foreground font-medium text-background text-sm outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50"
              href={cta.href}
              onClick={onClose}
            >
              {cta.label}
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}

function MobileMenuButton({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Button
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="rounded-shell-sm lg:hidden"
      onClick={onToggle}
      size="icon"
      variant="ghost"
    >
      <MenuIcon open={open} />
    </Button>
  );
}

/**
 * The header on every page of both sites: the logo, the nav with its menus,
 * search on the docs, the theme toggle, the account menu, and one call to
 * action. Below lg the nav moves into a menu sheet.
 */
export function SiteHeader({
  items: siteItems = [],
  cta: siteCta,
  libraryItems,
  libraryCta,
  variant,
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const isLanding = variant ? variant === "landing" : isLandingPath(pathname);
  const isLibrary = Boolean(libraryItems) && isLibraryPath(pathname);
  const items = isLibrary && libraryItems ? libraryItems : siteItems;
  const cta = isLibrary ? libraryCta : siteCta;

  // Wait for mount to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // The menu closes when the page changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on navigation.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  // Only use resolved theme after mount to avoid hydration mismatch.
  const logoTheme = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-50 border-border border-b bg-background/95 text-foreground backdrop-blur-xl",
          isLanding && "syntiq",
          mobileMenuOpen && "max-lg:bg-background",
        )}
        ref={headerRef}
      >
        <div
          className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8"
          style={{ viewTransitionName: "site-header" }}
        >
          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-shell-sm font-semibold text-[17px] text-foreground tracking-tight no-underline outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring/50"
            href="/"
          >
            <CortexcnLogo size={22} theme={logoTheme} />
            <span>Cortexcn</span>
          </Link>

          <HeaderNav
            isLinkActive={(url) => isNavLinkActive(url, pathname)}
            items={items}
            pathname={pathname}
          />

          <div className="ml-auto flex items-center gap-1.5">
            {hasDocsSearch(pathname) && (
              <DocsSearchTrigger
                className="hidden w-44 md:inline-flex xl:w-52"
                hideIfDisabled
              />
            )}
            <ModeToggle />
            <UserMenu />
            {cta ? (
              <Link
                className="ml-1.5 hidden h-9 items-center rounded-shell-sm bg-foreground px-4 font-medium text-background text-sm shadow-sm outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
                href={cta.href}
              >
                {cta.label}
              </Link>
            ) : null}
            <MobileMenuButton
              onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
              open={mobileMenuOpen}
            />
          </div>
        </div>
      </header>

      <MobileMenu
        cta={cta}
        isOpen={mobileMenuOpen}
        items={items}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
