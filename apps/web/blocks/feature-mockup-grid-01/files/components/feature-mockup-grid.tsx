import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MockupFeature {
  title: string;
  description: string;
  /** The picture above the title. It is decorative, so screen readers skip it. */
  visual: ReactNode;
}

export interface FeatureMockupGridProps {
  /** Small label above the heading. */
  label?: string;
  heading?: string;
  /**
   * Five cards read best: the first two share the top row and the other
   * three share the row below. On phones each card takes the full width.
   */
  features?: MockupFeature[];
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Shared pieces                                                              */
/* -------------------------------------------------------------------------- */

/** A white window with a soft shadow, the base of most mockups. */
const WINDOW = "overflow-hidden rounded-lg border bg-card shadow-sm";

/** Fades a mockup out before it reaches the card's text. */
const FADE_OUT_BOTTOM = "mask-b-from-50%";

/** Lifts a mockup a little while the card is hovered. */
const LIFT_ON_HOVER =
  "transition-transform duration-300 ease-out motion-safe:group-hover:-translate-y-1";

/** A gray stand-in for a line of text or an image. */
function Placeholder({ className }: { className?: string }) {
  return <span className={cn("block rounded-full bg-muted", className)} />;
}

/** The top strip of a browser window: three dots and an address bar. */
function BrowserBar() {
  return (
    <div className="flex items-center gap-1 px-2.5 py-2">
      <span className="size-1.5 rounded-full bg-primary" />
      <span className="size-1.5 rounded-full bg-muted" />
      <span className="size-1.5 rounded-full bg-muted" />
      <Placeholder className="ml-2 h-1.5 flex-1" />
      <Placeholder className="ml-6 h-1.5 w-6" />
    </div>
  );
}

/** A small landing page: a headline, two lines of copy, a button, and an image. */
function LandingSketch({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        compact ? "px-2 pt-2" : "px-5 pt-3",
      )}
    >
      <Placeholder className="h-2 w-1/2" />
      <Placeholder className="mt-2 h-1 w-2/5" />
      <Placeholder className="mt-1 h-1 w-1/3" />
      <span
        className={cn(
          "mt-2.5 h-2 rounded-full bg-primary",
          compact ? "w-6" : "w-10",
        )}
      />
      <Placeholder
        className={cn("mt-3 w-full rounded-sm", compact ? "h-16" : "h-24")}
      />
    </div>
  );
}

/** Puts two faint pages behind its child, so it reads as one of a stack. */
function Stacked({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-x-5 -top-3 h-full rounded-lg border bg-card/50" />
      <div className="absolute inset-x-2.5 -top-1.5 h-full rounded-lg border bg-card/80" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

/** A 24px line icon drawn in the current text color. */
function Icon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-4", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path
        d="M12 3c.5 4.5 4 8 9 9-5 1-8.5 4.5-9 9-.5-4.5-4-8-9-9 5-1 8.5-4.5 9-9z"
        fill="currentColor"
      />
    </Icon>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <rect height="10" rx="2" width="14" x="5" y="11" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Icon>
  );
}

function TrendUpIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </Icon>
  );
}

function MailIcon() {
  return (
    <Icon>
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="M3 7l9 6 9-6" />
    </Icon>
  );
}

function BranchIcon() {
  return (
    <Icon>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path d="M6 7v10M18 9c0 4.5-4 6-12 8" />
    </Icon>
  );
}

function ChatIcon() {
  return (
    <Icon>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </Icon>
  );
}

function BoltIcon() {
  return (
    <Icon>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </Icon>
  );
}

function CalendarIcon() {
  return (
    <Icon>
      <rect height="16" rx="2" width="18" x="3" y="5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </Icon>
  );
}

/* -------------------------------------------------------------------------- */
/* Card 1: a prompt that generates sections                                   */
/* -------------------------------------------------------------------------- */

type DraftLayout = "image-right" | "centered" | "image-left";

const DRAFT_LAYOUTS: DraftLayout[] = ["image-right", "centered", "image-left"];

/** One of the three section drafts the assistant offers. */
function DraftSketch({ layout }: { layout: DraftLayout }) {
  return (
    <div className="flex h-24 flex-col gap-1.5 rounded-sm border bg-card p-1.5">
      <div className="flex items-center gap-1">
        <span className="size-1 rounded-full bg-primary/60" />
        <Placeholder className="h-1 w-1/3" />
      </div>
      {layout === "centered" ? (
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <Placeholder className="h-1.5 w-3/4" />
          <Placeholder className="h-1 w-1/2" />
        </div>
      ) : (
        <div
          className={cn(
            "flex gap-1.5",
            layout === "image-left" && "flex-row-reverse",
          )}
        >
          <div className="flex flex-1 flex-col gap-1 pt-0.5">
            <Placeholder className="h-1.5 w-full" />
            <Placeholder className="h-1 w-2/3" />
          </div>
          <Placeholder className="h-6 w-1/3 rounded-sm" />
        </div>
      )}
      <Placeholder className="w-full flex-1 rounded-sm" />
    </div>
  );
}

function AssistantVisual() {
  return (
    <>
      <div
        className={cn(
          WINDOW,
          FADE_OUT_BOTTOM,
          "absolute inset-x-6 top-6 sm:inset-x-14",
        )}
      >
        <BrowserBar />
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[10px] text-foreground">
              Pick a section
            </span>
            <span className="flex size-4 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <SparkleIcon className="size-2.5" />
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            {DRAFT_LAYOUTS.map((layout) => (
              <DraftSketch key={layout} layout={layout} />
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          LIFT_ON_HOVER,
          "absolute inset-x-0 bottom-5 mx-auto flex w-60 max-w-[85%] items-center gap-2 rounded-lg border border-primary/30 bg-card p-1 pl-3 shadow-lg ring-4 ring-primary/5",
        )}
      >
        <span className="flex-1 truncate text-[10px] text-muted-foreground">
          Describe the section you need
        </span>
        <span className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 font-medium text-[10px] text-primary-foreground">
          <SparkleIcon className="size-2.5" />
          Generate
        </span>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Card 2: a stack of templates                                               */
/* -------------------------------------------------------------------------- */

function TemplatesVisual() {
  return (
    <Stacked
      className={cn(FADE_OUT_BOTTOM, "absolute inset-x-8 top-9 sm:inset-x-16")}
    >
      <div className={cn(WINDOW, LIFT_ON_HOVER)}>
        <BrowserBar />
        <LandingSketch />
      </div>
    </Stacked>
  );
}

/* -------------------------------------------------------------------------- */
/* Card 3: a page views chart                                                 */
/* -------------------------------------------------------------------------- */

/** Bar heights as a percent of the chart's height. */
const PAGE_VIEWS = [
  { month: "Jan", value: 48 },
  { month: "Feb", value: 60 },
  { month: "Mar", value: 74 },
  { month: "Apr", value: 66 },
  { month: "May", value: 42 },
  { month: "Jun", value: 62 },
  { month: "Jul", value: 70 },
  { month: "Aug", value: 86 },
  { month: "Sep", value: 58 },
];

function PerformanceVisual() {
  return (
    <Stacked
      className={cn(FADE_OUT_BOTTOM, "absolute inset-x-6 top-12 sm:inset-x-8")}
    >
      <div className={cn(WINDOW, LIFT_ON_HOVER, "p-3")}>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[11px] text-foreground">
            Page views
          </span>
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-medium text-[9px] text-emerald-600 dark:text-emerald-400">
            <TrendUpIcon className="size-2.5" />
            25%
          </span>
        </div>

        <div className="mt-3 flex h-20 items-end gap-1.5">
          {PAGE_VIEWS.map(({ month, value }) => (
            <span
              className="flex-1 rounded-t-sm bg-linear-to-b from-primary to-primary/30"
              key={month}
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {PAGE_VIEWS.map(({ month }) => (
            <span
              className="flex-1 text-center text-[8px] text-muted-foreground"
              key={month}
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </Stacked>
  );
}

/* -------------------------------------------------------------------------- */
/* Card 4: apps orbiting a secure center                                      */
/* -------------------------------------------------------------------------- */

interface Integration {
  name: string;
  icon: ReactNode;
  /** Where it sits on the outer ring, in percent of the ring's box. */
  x: number;
  y: number;
}

/** Swap these icons for the logos of the apps you connect to. */
const INTEGRATIONS: Integration[] = [
  { name: "Email", icon: <MailIcon />, x: 50, y: 0 },
  { name: "Code", icon: <BranchIcon />, x: 98, y: 37 },
  { name: "Chat", icon: <ChatIcon />, x: 88, y: 82 },
  { name: "Automation", icon: <BoltIcon />, x: 18, y: 88 },
  { name: "Calendar", icon: <CalendarIcon />, x: 3, y: 33 },
];

function IntegrationsVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-4">
      <div className="relative size-44 rounded-full border">
        <div className="absolute inset-6 rounded-full border bg-card/40" />
        <div className="absolute inset-14 rounded-full bg-primary/10" />

        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
          <LockIcon className="size-4" />
        </span>

        {INTEGRATIONS.map((integration) => (
          <span
            className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-card text-foreground shadow-sm"
            key={integration.name}
            style={{ left: `${integration.x}%`, top: `${integration.y}%` }}
          >
            {integration.icon}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card 5: the same page on a laptop and a phone                              */
/* -------------------------------------------------------------------------- */

function ResponsiveVisual() {
  return (
    <div className={cn(FADE_OUT_BOTTOM, "absolute inset-0")}>
      <div className={cn(WINDOW, "absolute top-6 right-12 left-3 sm:right-16")}>
        <BrowserBar />
        <LandingSketch />
      </div>

      <div
        className={cn(
          WINDOW,
          LIFT_ON_HOVER,
          "absolute top-14 right-3 w-[36%] max-w-28 rounded-xl shadow-md",
        )}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="size-1.5 rounded-full bg-primary" />
          <Placeholder className="h-1.5 w-1/3" />
        </div>
        <LandingSketch compact />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The section                                                                */
/* -------------------------------------------------------------------------- */

const DEFAULT_FEATURES: MockupFeature[] = [
  {
    title: "Generate sections from a prompt",
    description:
      "Describe the section you need and choose from three drafts. Each one uses your fonts, colors, and spacing.",
    visual: <AssistantVisual />,
  },
  {
    title: "Start from a template",
    description:
      "Pick a layout that fits your product, then change the fonts, colors, and copy until it reads like your brand.",
    visual: <TemplatesVisual />,
  },
  {
    title: "Search insights built in",
    description:
      "Track page views month by month and see which pages need attention.",
    visual: <PerformanceVisual />,
  },
  {
    title: "Connect your tools",
    description:
      "Send sign-ups, messages, and orders to the apps your team already uses.",
    visual: <IntegrationsVisual />,
  },
  {
    title: "Ready for every screen",
    description:
      "Pages adjust from phones to wide monitors, with no separate mobile version to keep up.",
    visual: <ResponsiveVisual />,
  },
];

function FeatureCard({
  feature,
  className,
}: {
  feature: MockupFeature;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-muted/40",
        className,
      )}
    >
      <div aria-hidden="true" className="relative h-52 overflow-hidden">
        {feature.visual}
      </div>
      <div className="px-6 pb-6">
        <h3 className="font-medium text-foreground text-lg tracking-tight">
          {feature.title}
        </h3>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function FeatureMockupGrid({
  label = "Features",
  heading = "One place to design, launch, and grow your website",
  features = DEFAULT_FEATURES,
  className,
}: FeatureMockupGridProps) {
  return (
    <section className={cn("w-full px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <p className="flex items-center gap-2 font-semibold text-primary text-xs uppercase tracking-widest">
          <span aria-hidden="true" className="h-4 w-px bg-primary" />
          {label}
        </p>
        <h2 className="mt-4 max-w-xl text-balance text-center font-semibold text-3xl text-foreground tracking-tight sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-12 grid w-full gap-4 md:grid-cols-6">
          {features.map((feature, index) => (
            <FeatureCard
              className={index < 2 ? "md:col-span-3" : "md:col-span-2"}
              feature={feature}
              key={feature.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
