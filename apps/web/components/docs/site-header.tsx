"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { UserMenu } from "@/components/auth/user-menu";
import { ActionLink } from "@/components/landing/kit";
import { ModeToggle } from "@/components/mode-toggle";
import {
  COMPONENT_GROUPS,
  type ComponentGroup,
} from "@/lib/component-families";
import { familyForPath } from "@/lib/docs-sidebar";
import { isLibraryPath } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import { CortexcnLogo } from "../icons/cortexcn";
import { Button } from "../ui/button";
import { DocsSearchTrigger } from "./docs-search-trigger";
import { HeaderNav } from "./header-nav";
import { NavLinkLabel } from "./nav-link-label";

interface NavLink {
  text: string;
  url: string;
  active?: "url" | "nested-url";
}

interface SiteHeaderProps {
  links?: NavLink[];
  /**
   * Nav for the component library pages (docs, blocks, and charts), which
   * belong to ui.cortexcn.dev rather than the services site.
   */
  libraryLinks?: NavLink[];
  /**
   * Header style. By default the landing-kit pages get the boxed landing
   * header and every other page the plain one; pass it where the URL alone
   * cannot tell, such as a page served at `/` through a rewrite.
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

function mobileMenuSections(pathname: string) {
  const family = familyForPath(pathname);
  return family ? FAMILY_SECTIONS[family.category] : [FAMILY_LINKS];
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

const STAGGER_DURATION = 650; // Total duration for all staggered items (ms)

const HEADER_SCROLL_THRESHOLD = 8;

/** Pages built from the landing kit, which get the boxed landing header. */
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

/**
 * Whether a nav link stands for the section the page is in, so its tab stays
 * lit on every page inside it: Docs covers /docs, except the component family
 * sections (Components, Cortex, Backgrounds, and Charts, with the chart
 * utilities), which belong to Components, and Charts covers the whole /charts
 * gallery.
 */
function isNavLinkActive(url: string, pathname: string) {
  const inDocs = pathname === "/docs" || pathname.startsWith("/docs/");
  const inComponents = familyForPath(pathname) !== undefined;
  if (url.startsWith("/docs/components")) {
    return inComponents;
  }
  if (url.startsWith("/docs")) {
    return inDocs && !inComponents;
  }
  const section = `/${url.split("/")[1] ?? ""}`;
  return pathname === section || pathname.startsWith(`${section}/`);
}

const activeMenuItemClassName = "bg-muted text-foreground";

/**
 * Classes that depend on where the header swaps its nav for the menu button.
 * The library nav keeps the menu button until lg, where the docs sidebar
 * also appears. The landing nav has seven tabs plus the account menu, so it
 * keeps the menu button until xl.
 */
const MENU_BREAKPOINT = {
  xl: {
    hideMenu: "xl:hidden",
    menuOpenBackground: "max-xl:bg-background",
    menuOpenFullWidth: "max-xl:max-w-none",
  },
  lg: {
    hideMenu: "lg:hidden",
    menuOpenBackground: "max-lg:bg-background",
    menuOpenFullWidth: "max-lg:max-w-none",
  },
} as const;

function menuBreakpoint(landing?: boolean) {
  return MENU_BREAKPOINT[landing ? "xl" : "lg"];
}

/** A mobile menu section heading, which links to that section's overview. */
const sectionHeadingClassName =
  "mb-1 block px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider outline-none transition-[opacity,transform,color] duration-300 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:underline aria-[current=page]:text-foreground";

function getScrollTop() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getIsScrolled() {
  return getScrollTop() > HEADER_SCROLL_THRESHOLD;
}

function useIsScrolled() {
  return useSyncExternalStore(subscribeToScroll, getIsScrolled, () => false);
}

interface MobileMenuProps {
  links: NavLink[];
  isOpen: boolean;
  onClose: () => void;
  /** Adopt the landing page theme (fonts and palette). */
  landing?: boolean;
}

function MobileMenu({ links, isOpen, onClose, landing }: MobileMenuProps) {
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

  const breakpoint = menuBreakpoint(landing);
  const sections = mobileMenuSections(pathname);
  // Stagger order: the main links, then each section's heading and pages.
  const sectionStarts: number[] = [];
  let totalItems = links.length;
  for (const section of sections) {
    sectionStarts.push(totalItems + 1);
    totalItems += 1 + section.items.length;
  }
  const staggerDelay = totalItems > 1 ? STAGGER_DURATION / (totalItems - 1) : 0;

  const getStaggerStyle = (index: number) => ({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(4px)",
    transitionDelay: isOpen ? `${index * staggerDelay}ms` : "0ms",
  });

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          breakpoint.hideMenu,
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 top-(--site-header-height) bottom-0 z-50 flex flex-col overflow-hidden border-border border-b bg-background transition-[transform,opacity] duration-300 ease-out",
          breakpoint.hideMenu,
          landing && "syntiq",
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-4 py-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] [-webkit-overflow-scrolling:touch]">
          {/* Main links */}
          <div className="flex flex-col gap-0.5">
            {links.map((link, index) => {
              const active = isNavLinkActive(link.url, pathname);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className="transition-[opacity,transform] duration-300 ease-out"
                  href={link.url}
                  key={link.url}
                  onClick={onClose}
                  style={getStaggerStyle(index)}
                >
                  <Button
                    className={cn(
                      "h-10 w-full justify-start px-3",
                      active && activeMenuItemClassName,
                    )}
                    size="default"
                    variant="ghost"
                  >
                    <NavLinkLabel text={link.text} url={link.url} />
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* The family the page is in, or one link per family */}
          {sections.map((section, sectionIndex) => {
            const start = sectionStarts[sectionIndex] ?? 0;
            return (
              <div
                className="mt-3 border-border border-t pt-3"
                key={section.title}
              >
                {section.href ? (
                  <Link
                    aria-current={
                      pathname === section.href ? "page" : undefined
                    }
                    className={sectionHeadingClassName}
                    href={section.href}
                    onClick={onClose}
                    style={getStaggerStyle(start - 1)}
                  >
                    {section.title}
                  </Link>
                ) : (
                  <span
                    className={sectionHeadingClassName}
                    style={getStaggerStyle(start - 1)}
                  >
                    {section.title}
                  </span>
                )}
                <div className="flex flex-col gap-0.5">
                  {section.items.map((item, index) => (
                    <Link
                      aria-current={pathname === item.url ? "page" : undefined}
                      className="transition-[opacity,transform] duration-300 ease-out"
                      href={item.url}
                      key={item.url}
                      onClick={onClose}
                      style={getStaggerStyle(start + index)}
                    >
                      <Button
                        className={cn(
                          "h-10 w-full justify-start px-3",
                          pathname === item.url && activeMenuItemClassName,
                        )}
                        size="default"
                        variant="ghost"
                      >
                        {item.text}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}

function MobileMenuButton({
  open,
  onToggle,
  className,
  landing,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
  /** On the landing header, which collapses at xl rather than lg. */
  landing?: boolean;
}) {
  return (
    <Button
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className={cn(menuBreakpoint(landing).hideMenu, className)}
      onClick={onToggle}
      size="default"
      variant="ghost"
    >
      <MenuIcon open={open} />
    </Button>
  );
}

/** Landing header: a brand tab, joined nav tabs, and boxed utilities. */
function LandingHeaderItems({
  links,
  menuButton,
}: {
  links: NavLink[];
  menuButton: ReactNode;
}) {
  const pathname = usePathname();
  const tabClassName =
    "inline-flex h-9 items-center border-border border-y border-r bg-background px-3 font-mono text-foreground text-sm uppercase transition-colors hover:bg-primary hover:text-primary-foreground";

  return (
    <>
      <div className="flex items-center">
        <Link
          className="inline-flex h-9 items-center gap-2 bg-primary px-3 font-medium font-mono text-primary-foreground text-sm uppercase transition-opacity hover:opacity-90"
          href="/"
        >
          <CortexcnLogo size={18} theme="dark" />
          Cortexcn
        </Link>
        <nav className="hidden items-center xl:flex">
          {links.map((link) => {
            const active = isNavLinkActive(link.url, pathname);
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  tabClassName,
                  // The page you are on stays filled in, like a pressed key.
                  active &&
                    "border-foreground bg-foreground text-background hover:bg-foreground hover:text-background",
                )}
                href={link.url}
                key={link.url}
              >
                <NavLinkLabel text={link.text} url={link.url} />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-9 items-center gap-0.5 border border-border bg-background px-0.5">
          {/* From lg up: at tablet widths the nav tabs need the room. */}
          {hasDocsSearch(pathname) && (
            <DocsSearchTrigger
              className="hidden w-30 justify-between lg:inline-flex"
              hideIfDisabled
            />
          )}
          <ModeToggle />
          {menuButton}
        </div>
        {/* Same page as the Docs tab, so it only joins once everything fits. */}
        <ActionLink
          className="hidden 2xl:inline-flex"
          href="/docs/installation"
          label="Get started"
          size="sm"
          variant="outline"
        />
        <UserMenu />
      </div>
    </>
  );
}

export function SiteHeader({
  links: siteLinks = [],
  libraryLinks,
  variant,
}: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isScrolled = useIsScrolled();
  const headerRef = useRef<HTMLElement>(null);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  // The landing-styled pages open on a grid band, so their header draws every
  // item as a solid box that stays readable on the band in either theme.
  const isHome = variant ? variant === "landing" : isLandingPath(pathname);
  const breakpoint = menuBreakpoint(isHome);
  const links =
    libraryLinks && isLibraryPath(pathname) ? libraryLinks : siteLinks;

  // Wait for mount to avoid hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);

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
          // Stays put on scroll: it only gains a backdrop so the page reads under it.
          "fixed top-0 right-0 left-0 z-50 border-b px-2.5 transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
          isScrolled
            ? "border-border bg-background/85 backdrop-blur-sm"
            : "border-transparent",
          isHome && "syntiq",
          mobileMenuOpen && breakpoint.menuOpenBackground,
        )}
        data-scrolled={isScrolled ? "" : undefined}
        ref={headerRef}
      >
        <div
          className={cn(
            // On the landing page, line items up with the page's Container
            // (1264px wide with 16/24/32px gutters) after the header's own 10px inset.
            isHome
              ? "mx-auto w-full max-w-[1244px] px-1.5 sm:px-3.5 lg:px-5.5"
              : "container mx-auto",
            mobileMenuOpen && breakpoint.menuOpenFullWidth,
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-6 border border-transparent py-4",
              mobileMenuOpen && breakpoint.menuOpenBackground,
            )}
            style={{ viewTransitionName: "site-header" }}
          >
            {isHome ? (
              <LandingHeaderItems
                links={links}
                menuButton={
                  <MobileMenuButton
                    className="size-8"
                    landing
                    onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                    open={mobileMenuOpen}
                  />
                }
              />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Link
                    className="mr-2 inline-flex items-center gap-2 font-semibold text-foreground text-lg tracking-tight no-underline transition-opacity hover:opacity-80"
                    href="/"
                  >
                    <CortexcnLogo size={24} theme={logoTheme} />
                    <span>Cortexcn</span>
                  </Link>

                  {/* Desktop nav, with the Components menu */}
                  <HeaderNav
                    activeClassName={activeMenuItemClassName}
                    isActive={(url) => isNavLinkActive(url, pathname)}
                    links={links}
                  />
                </div>

                <div className="flex items-center gap-1">
                  {/* From lg up, as an icon until xl, where the full nav leaves room for the shortcut too. */}
                  {hasDocsSearch(pathname) && (
                    <DocsSearchTrigger
                      className="hidden lg:inline-flex xl:w-30 xl:justify-between [&_kbd]:hidden xl:[&_kbd]:inline-flex"
                      hideIfDisabled
                    />
                  )}
                  <ModeToggle />
                  <UserMenu />
                  <MobileMenuButton
                    onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                    open={mobileMenuOpen}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        landing={isHome}
        links={links}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
