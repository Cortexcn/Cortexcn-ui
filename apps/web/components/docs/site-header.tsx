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
import { ModeToggle } from "@/components/mode-toggle";
import { isLibraryPath } from "@/lib/site-url";
import { cn } from "@/lib/utils";
import { CortexcnLogo } from "../icons/cortexcn";
import { Button } from "../ui/button";
import { DocsSearchTrigger } from "./docs-search-trigger";
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
  { text: "Command Search", url: "/docs/components/command-search" },
  { text: "Fan-Out Diagram", url: "/docs/components/fan-out-diagram" },
  { text: "FAQ Tabs Card", url: "/docs/components/faq-tabs-card" },
  { text: "Line Nav", url: "/docs/components/line-nav" },
  { text: "Logos Carousel", url: "/docs/components/logos-carousel" },
  { text: "Marquee", url: "/docs/components/marquee" },
  { text: "Number Ticker", url: "/docs/components/number-ticker" },
  {
    text: "Perspective Marquee",
    url: "/docs/components/perspective-marquee",
  },
  { text: "Theme Toggle Effect", url: "/docs/components/theme-toggle-effect" },
  { text: "Work Experience", url: "/docs/components/work-experience" },
];

const backgroundComponents = [
  { text: "Light Speed", url: "/docs/components/light-speed" },
];

const components = [
  { text: "Area Chart", url: "/docs/components/area-chart" },
  { text: "Bar Chart", url: "/docs/components/bar-chart" },
  { text: "Candlestick Chart", url: "/docs/components/candlestick-chart" },
  { text: "Choropleth Chart", url: "/docs/components/choropleth-chart" },
  { text: "Composed Chart", url: "/docs/components/composed-chart" },
  { text: "Funnel Chart", url: "/docs/components/funnel-chart" },
  { text: "Gauge", url: "/docs/components/gauge-chart" },
  { text: "Heatmap Chart", url: "/docs/components/heatmap-chart" },
  { text: "Line Chart", url: "/docs/components/line-chart" },
  { text: "Profit/Loss Line", url: "/docs/components/profit-loss-line" },
  { text: "Live Line Chart", url: "/docs/components/live-line-chart" },
  { text: "Pie Chart", url: "/docs/components/pie-chart" },
  { text: "Radar Chart", url: "/docs/components/radar-chart" },
  { text: "Ring Chart", url: "/docs/components/ring-chart" },
  { text: "Scatter Chart", url: "/docs/components/scatter-chart" },
  { text: "Sankey Chart", url: "/docs/components/sankey-chart" },
  { text: "Sunburst Chart", url: "/docs/components/sunburst-chart" },
];

const utilities = [
  { text: "Legend", url: "/docs/utility/legend" },
  { text: "Grid", url: "/docs/utility/grid" },
  { text: "Background", url: "/docs/utility/background" },
  { text: "Reference Area", url: "/docs/utility/reference-area" },
  { text: "Projection Line", url: "/docs/utility/projection-line" },
  { text: "Tooltip", url: "/docs/utility/tooltip" },
  { text: "Brush", url: "/docs/utility/brush" },
  {
    text: "Axis",
    children: [
      { text: "X Axis", url: "/docs/utility/axis/x-axis" },
      { text: "Y Axis", url: "/docs/utility/axis/y-axis" },
    ],
  },
  { text: "Custom Indicator", url: "/docs/utility/custom-indicator" },
  { text: "useChart", url: "/docs/utility/use-chart" },
];

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
  "/contact",
  "/pricing",
  "/privacy",
  "/refunds",
  "/terms",
]);

/**
 * Whether a nav link stands for the section the page is in, so its tab stays
 * lit on every page inside it: Docs covers /docs, except the component pages,
 * which belong to Components, and Charts covers the whole /charts gallery.
 */
/** Search covers the docs, so it only shows in the header on the docs and chart pages. */
function hasDocsSearch(pathname: string) {
  return ["/docs", "/charts"].some(
    (section) => pathname === section || pathname.startsWith(`${section}/`),
  );
}

function isNavLinkActive(url: string, pathname: string) {
  const inDocs = pathname === "/docs" || pathname.startsWith("/docs/");
  const inComponents = pathname.startsWith("/docs/components");
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
  staggerDelay: number;
  /** Adopt the landing page theme (fonts and palette). */
  landing?: boolean;
}

function MobileMenu({
  links,
  isOpen,
  onClose,
  staggerDelay,
  landing,
}: MobileMenuProps) {
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

  const getStaggerStyle = (index: number) => ({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "translateY(0)" : "translateY(4px)",
    transitionDelay: isOpen ? `${index * staggerDelay}ms` : "0ms",
  });

  const baseStartIndex = links.length + 1;
  const cortexStartIndex = baseStartIndex + baseComponents.length + 1;
  const backgroundsStartIndex = cortexStartIndex + cortexComponents.length + 1;
  const componentsStartIndex =
    backgroundsStartIndex + backgroundComponents.length + 1;
  const componentGroups = [
    { title: "Components", items: baseComponents, start: baseStartIndex },
    { title: "Cortex", items: cortexComponents, start: cortexStartIndex },
    {
      title: "Backgrounds",
      items: backgroundComponents,
      start: backgroundsStartIndex,
    },
  ];
  const utilitiesStartIndex = componentsStartIndex + components.length + 1;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 top-(--site-header-height) bottom-0 z-50 flex flex-col overflow-hidden border-border border-b bg-background transition-[transform,opacity] duration-300 ease-out md:hidden",
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

          {/* Components, Cortex, and Backgrounds sections */}
          {componentGroups.map((group) => (
            <div className="mt-3 border-border border-t pt-3" key={group.title}>
              <span
                className="mb-1 block px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider transition-[opacity,transform] duration-300 ease-out"
                style={getStaggerStyle(group.start - 1)}
              >
                {group.title}
              </span>
              <div className="flex flex-col gap-0.5">
                {group.items.map((component, index) => (
                  <Link
                    aria-current={
                      pathname === component.url ? "page" : undefined
                    }
                    className="transition-[opacity,transform] duration-300 ease-out"
                    href={component.url}
                    key={component.url}
                    onClick={onClose}
                    style={getStaggerStyle(group.start + index)}
                  >
                    <Button
                      className={cn(
                        "h-10 w-full justify-start px-3",
                        pathname === component.url && activeMenuItemClassName,
                      )}
                      size="default"
                      variant="ghost"
                    >
                      {component.text}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Charts section */}
          <div className="mt-3 border-border border-t pt-3">
            <span
              className="mb-1 block px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider transition-[opacity,transform] duration-300 ease-out"
              style={getStaggerStyle(componentsStartIndex - 1)}
            >
              Charts
            </span>
            <div className="flex flex-col gap-0.5">
              {components.map((component, index) => (
                <Link
                  className="transition-[opacity,transform] duration-300 ease-out"
                  href={component.url}
                  key={component.url}
                  onClick={onClose}
                  style={getStaggerStyle(componentsStartIndex + index)}
                >
                  <Button
                    className="h-10 w-full justify-start px-3"
                    size="default"
                    variant="ghost"
                  >
                    {component.text}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Chart utilities section */}
          <div className="mt-3 border-border border-t pt-3">
            <span
              className="mb-1 block px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider transition-[opacity,transform] duration-300 ease-out"
              style={getStaggerStyle(utilitiesStartIndex - 1)}
            >
              Chart Utilities
            </span>
            <div className="flex flex-col gap-0.5">
              {utilities.flatMap((utility, i) => {
                if ("children" in utility && utility.children) {
                  return [
                    <span
                      className="mt-2 mb-1 block px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider first:mt-0"
                      key={`axis-${utility.text}`}
                      style={getStaggerStyle(utilitiesStartIndex + 1 + i)}
                    >
                      {utility.text}
                    </span>,
                    ...utility.children.map((child, j) => (
                      <Link
                        className="pl-4 transition-[opacity,transform] duration-300 ease-out"
                        href={child.url}
                        key={child.url}
                        onClick={onClose}
                        style={getStaggerStyle(
                          utilitiesStartIndex +
                            2 +
                            utilities
                              .slice(0, i)
                              .flatMap((u) =>
                                "children" in u && u.children
                                  ? u.children
                                  : [u],
                              ).length +
                            j,
                        )}
                      >
                        <Button
                          className="h-10 w-full justify-start px-3"
                          size="default"
                          variant="ghost"
                        >
                          {child.text}
                        </Button>
                      </Link>
                    )),
                  ];
                }
                const flatIndex = utilities
                  .slice(0, i)
                  .flatMap((u) =>
                    "children" in u && u.children ? [1, ...u.children] : [1],
                  ).length;
                return (
                  <Link
                    className="transition-[opacity,transform] duration-300 ease-out"
                    href={utility.url}
                    key={utility.url}
                    onClick={onClose}
                    style={getStaggerStyle(utilitiesStartIndex + 1 + flatIndex)}
                  >
                    <Button
                      className="h-10 w-full justify-start px-3"
                      size="default"
                      variant="ghost"
                    >
                      {utility.text}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

function MobileMenuButton({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className={cn("md:hidden", className)}
      onClick={onToggle}
      size="default"
      variant="ghost"
    >
      <MenuIcon open={open} />
    </Button>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
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
        <nav className="hidden items-center md:flex">
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
        <Link
          className="hidden h-9 items-center gap-2.5 border border-border bg-background px-4 font-medium font-mono text-foreground text-sm uppercase transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground xl:inline-flex"
          href="/docs/installation"
        >
          <ArrowUpRightIcon />
          Get started
        </Link>
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
  const isHome = variant ? variant === "landing" : LANDING_PATHS.has(pathname);
  const links =
    libraryLinks && isLibraryPath(pathname) ? libraryLinks : siteLinks;

  // Calculate stagger delay based on total items to complete in STAGGER_DURATION
  const utilitiesCount =
    1 +
    utilities.flatMap((u) =>
      "children" in u && u.children ? [1, ...u.children] : [1],
    ).length;
  const totalItems =
    links.length +
    1 + // Components header
    baseComponents.length +
    1 + // Cortex header
    cortexComponents.length +
    1 + // Backgrounds header
    backgroundComponents.length +
    1 + // Charts header
    components.length +
    1 + // Utilities header
    utilitiesCount;
  const staggerDelay = totalItems > 1 ? STAGGER_DURATION / (totalItems - 1) : 0;

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
          mobileMenuOpen && "max-md:bg-background",
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
            mobileMenuOpen && "max-md:max-w-none",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-6 border border-transparent py-4",
              mobileMenuOpen && "max-md:bg-background",
            )}
            style={{ viewTransitionName: "site-header" }}
          >
            {isHome ? (
              <LandingHeaderItems
                links={links}
                menuButton={
                  <MobileMenuButton
                    className="size-8"
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

                  {/* Desktop nav */}
                  <nav className="hidden items-center gap-1 md:flex">
                    {links.map((link) => {
                      const active = isNavLinkActive(link.url, pathname);
                      return (
                        <Link
                          aria-current={active ? "page" : undefined}
                          href={link.url}
                          key={link.url}
                        >
                          <Button
                            className={cn(active && activeMenuItemClassName)}
                            variant="ghost"
                          >
                            <NavLinkLabel text={link.text} url={link.url} />
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex items-center gap-1">
                  {/* From lg up: at tablet widths the nav links need the room. */}
                  {hasDocsSearch(pathname) && (
                    <DocsSearchTrigger
                      className="hidden w-30 justify-between lg:inline-flex"
                      hideIfDisabled
                    />
                  )}
                  <ModeToggle />
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
        staggerDelay={staggerDelay}
      />
    </>
  );
}
