import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureAction {
  label: string;
  href: string;
}

export interface MediaCardFeature {
  title: string;
  description: string;
  image: { src: string; alt: string };
  icon?: ReactNode;
}

export interface FeatureMediaCardsProps {
  heading?: string;
  primaryAction?: FeatureAction;
  secondaryAction?: FeatureAction;
  /** Three cards fill the row on large screens. */
  features?: MediaCardFeature[];
  className?: string;
}

function TileIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

const IMAGE_BASE = "https://www.cortexcn.dev/svgs";

const DEFAULT_FEATURES: MediaCardFeature[] = [
  {
    title: "Live dashboards",
    description:
      "Drop in charts that update as your data changes, with tooltips and legends already wired up.",
    image: { src: `${IMAGE_BASE}/area-chart.svg`, alt: "Area chart preview" },
    icon: (
      <TileIcon>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
      </TileIcon>
    ),
  },
  {
    title: "Reports that explain",
    description:
      "Pair numbers with clear visuals so the whole team reads the same story from the data.",
    image: {
      src: `${IMAGE_BASE}/composed-chart.svg`,
      alt: "Composed chart preview",
    },
    icon: (
      <TileIcon>
        <rect height="16" rx="2" width="14" x="5" y="4" />
        <path d="M9 9h6M9 13h6M9 17h3" />
      </TileIcon>
    ),
  },
  {
    title: "Share in one click",
    description:
      "Send a link or embed a view anywhere, and every viewer sees the latest numbers.",
    image: { src: `${IMAGE_BASE}/radar-chart.svg`, alt: "Radar chart preview" },
    icon: (
      <TileIcon>
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="M8.2 10.9l7.6-3.8M8.2 13.1l7.6 3.8" />
      </TileIcon>
    ),
  },
];

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function FeatureMediaCards({
  heading = "Turn your data into pages people act on",
  primaryAction = { label: "Get started", href: "#" },
  secondaryAction = { label: "See how it works", href: "#" },
  features = DEFAULT_FEATURES,
  className,
}: FeatureMediaCardsProps) {
  return (
    <section className={cn("px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-2xl text-balance font-semibold text-3xl tracking-tight sm:text-4xl">
            {heading}
          </h2>
          <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <a
              className={cn(buttonVariants(), "gap-2 px-4")}
              href={primaryAction.href}
            >
              {primaryAction.label}
              <ArrowRightIcon />
            </a>
            <a
              className={cn(buttonVariants({ variant: "outline" }), "px-4")}
              href={secondaryAction.href}
            >
              {secondaryAction.label}
            </a>
          </div>
        </div>

        <ul className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {features.map((feature) => (
            <li className="flex flex-col" key={feature.title}>
              <div className="overflow-hidden rounded-xl border bg-muted">
                {/* biome-ignore lint/performance/noImgElement: framework-agnostic registry block */}
                <img
                  alt={feature.image.alt}
                  className="aspect-16/10 w-full object-cover object-top"
                  decoding="async"
                  height={500}
                  loading="lazy"
                  src={feature.image.src}
                  width={800}
                />
              </div>
              <div className="mt-6 flex items-start gap-4">
                {feature.icon ? (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card shadow-xs">
                    {feature.icon}
                  </span>
                ) : null}
                <div>
                  <h3 className="font-semibold text-lg tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
