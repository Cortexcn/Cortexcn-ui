"use client";

import { useId } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BentoImage {
  src: string;
  alt: string;
}

export interface BentoFeature {
  title: string;
  /** Each entry is its own paragraph. */
  description: string[];
  image: BentoImage;
}

export interface FeatureMixedBentoProps {
  /** Small mono label above the grid. */
  eyebrow?: string;
  /**
   * Four cards, each laid out its own way: image beside the copy, below it,
   * above it, then rising from the bottom edge. More cards repeat the cycle.
   */
  features?: BentoFeature[];
  className?: string;
}

/** The flower paintings from the Cortexcn site. */
const ART_BASE = "https://www.cortexcn.dev/images/ui-home";

const DEFAULT_FEATURES: BentoFeature[] = [
  {
    title: "Own every line of code",
    description: [
      "The shadcn CLI copies each component's source into your project, so nothing hides inside a package you can't change.",
      "Read it, restyle it, and ship it as yours, with no version to wait on and nothing to eject from later.",
    ],
    image: {
      src: `${ART_BASE}/pastel-meadow-flowers.webp`,
      alt: "A painting of white flowers swaying in a pale blue meadow",
    },
  },
  {
    title: "Charts that match your theme",
    description: [
      "Area, bar, line, sankey, choropleth, and more, drawn with your color tokens.",
      "Tooltips, legends, and animation come wired up, and every chart follows light and dark mode on its own.",
    ],
    image: {
      src: `${ART_BASE}/meadow-grass.webp`,
      alt: "A painting of tall grass bending in the wind",
    },
  },
  {
    title: "Whole sections, ready to drop in",
    description: [
      "Hero, feature, and services blocks you can preview live, then add to a page with one command.",
    ],
    image: {
      src: `${ART_BASE}/white-blooms.webp`,
      alt: "A painting of white blooms drifting in the wind",
    },
  },
  {
    title: "Built for your AI assistant",
    description: [
      "Point Claude Code, Cursor, or Codex at the Cortexcn MCP server and it can search every component, read the docs, and install what it needs.",
    ],
    image: {
      src: `${ART_BASE}/blue-white-flowers.webp`,
      alt: "A painting of white flowers against a pale blue sky",
    },
  },
];

type Layout = "beside" | "below" | "above" | "rising";

/** Card shapes in order on the five-column grid: three and two, then two and three. */
const LAYOUTS: Layout[] = ["beside", "below", "above", "rising"];

const SPANS: Record<Layout, string> = {
  beside: "md:col-span-3",
  below: "md:col-span-2",
  above: "md:col-span-2",
  rising: "md:col-span-3",
};

function FeatureText({
  feature,
  className,
}: {
  feature: BentoFeature;
  className?: string;
}) {
  return (
    <CardHeader className={cn("content-start gap-3 p-0", className)}>
      <CardTitle className="text-balance font-medium text-2xl tracking-tight md:text-3xl">
        <h3>{feature.title}</h3>
      </CardTitle>
      {feature.description.map((paragraph) => (
        <CardDescription
          className="font-medium text-base leading-snug"
          key={paragraph}
        >
          {paragraph}
        </CardDescription>
      ))}
    </CardHeader>
  );
}

function FeatureImage({
  image,
  className,
}: {
  image: BentoImage;
  className?: string;
}) {
  return (
    // biome-ignore lint/performance/noImgElement: framework-agnostic registry block
    <img
      alt={image.alt}
      className={cn("w-full object-cover", className)}
      decoding="async"
      height={896}
      loading="lazy"
      src={image.src}
      width={1344}
    />
  );
}

function FeatureCard({
  feature,
  layout,
  span,
}: {
  feature: BentoFeature;
  layout: Layout;
  span: string;
}) {
  if (layout === "beside") {
    // The image runs off the card's right edge.
    return (
      <Card
        className={cn("gap-6 py-6 pl-6 shadow-xl md:flex-row md:gap-12", span)}
      >
        <FeatureText className="pr-6 md:flex-1 md:pr-0" feature={feature} />
        <CardContent className="relative aspect-16/10 overflow-hidden rounded-l-xl border border-r-0 p-0 md:aspect-auto md:min-h-64 md:flex-1">
          <FeatureImage
            className="absolute inset-0 size-full"
            image={feature.image}
          />
        </CardContent>
      </Card>
    );
  }

  if (layout === "below") {
    return (
      <Card className={cn("justify-center gap-6 p-6 shadow-xl", span)}>
        <FeatureText feature={feature} />
        <CardContent className="p-0 not-first:pt-0">
          <FeatureImage
            className="aspect-[2/1.1] rounded-xl"
            image={feature.image}
          />
        </CardContent>
      </Card>
    );
  }

  if (layout === "above") {
    return (
      <Card className={cn("gap-6 p-6 shadow-xl", span)}>
        <CardContent className="p-0">
          <FeatureImage
            className="aspect-2/1 rounded-xl"
            image={feature.image}
          />
        </CardContent>
        <FeatureText feature={feature} />
      </Card>
    );
  }

  // The image rises from the card's bottom edge.
  return (
    <Card className={cn("gap-8 pt-6 pb-0 shadow-xl", span)}>
      <FeatureText className="px-6" feature={feature} />
      <CardContent className="relative mx-6 mt-auto aspect-[2/1.25] overflow-hidden rounded-t-xl border border-b-0 p-0 not-first:pt-0 md:mx-auto md:w-full md:max-w-100 lg:max-w-125">
        <FeatureImage
          className="absolute inset-0 size-full"
          image={feature.image}
        />
      </CardContent>
    </Card>
  );
}

export function FeatureMixedBento({
  eyebrow = "Why Cortexcn?",
  features = DEFAULT_FEATURES,
  className,
}: FeatureMixedBentoProps) {
  const patternId = useId();

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden px-6 py-24 sm:py-32",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-1/2 size-[700px] -translate-y-1/2 rounded-full bg-chart-1/30 blur-[300px]" />
        <div className="absolute top-1/2 right-0 size-[700px] -translate-y-1/2 -rotate-12 rounded-full bg-chart-2/15 blur-[300px]" />
        <div className="absolute right-20 bottom-10 h-[500px] w-[800px] -rotate-12 rounded-full bg-chart-3/[0.06] blur-[100px]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-20 inset-y-0 -z-10 [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_85%)]"
      >
        <svg
          aria-hidden="true"
          className="size-full text-foreground/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              height="16"
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="16"
            >
              <path d="M8 5v6M5 8h6" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect fill={`url(#${patternId})`} height="100%" width="100%" />
        </svg>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h2 className="font-mono font-semibold text-muted-foreground text-sm uppercase tracking-widest">
          {eyebrow}
        </h2>
        <div className="grid gap-6 md:grid-cols-5">
          {features.map((feature, index) => {
            const layout = LAYOUTS[index % LAYOUTS.length] ?? "beside";
            return (
              <FeatureCard
                feature={feature}
                key={feature.title}
                layout={layout}
                span={SPANS[layout]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
