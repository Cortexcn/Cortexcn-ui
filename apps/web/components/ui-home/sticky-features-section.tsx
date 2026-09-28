import type { CSSProperties, ReactNode } from "react";

import {
  FeatureSpotlightGrid,
  type SpotlightFeature,
} from "@/blocks/feature-spotlight-grid-01/files/components/feature-spotlight-grid";
import { cn } from "@/lib/utils";

import { AppWindow, RegistryTag } from "./app-window";
import { type Artwork, Painting } from "./painting";
import { Container, PrimaryLink } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { CampaignRadarTile } from "./sticky-features-section-chart";
import { ScaledPreview } from "./sticky-features-section-scale";
import { CommandPaletteTile } from "./sticky-features-section-search";
import { StackList } from "./sticky-features-section-stack";

const HEADING = [
  { text: "One registry." },
  { text: "Charts, motion, and whole sections.", muted: true },
];

/** Same lift as `AppWindow`, for tiles that bring their own frame. */
const TILE_SHADOW =
  "shadow-[0_30px_60px_-24px_rgb(28_26_21/0.35),0_2px_6px_rgb(28_26_21/0.06)] dark:shadow-[0_30px_60px_-24px_rgb(0_0_0/0.7)]";

/**
 * The cards stick only where a whole card fits on screen: `md` widths with at
 * least 36rem of height, the same query as `STACK_QUERY` in the stack helper.
 * Shorter screens, such as a phone held sideways, get a plain stack.
 */
const STACK_LIST_CLASS_NAME =
  "mt-12 flex flex-col gap-4 md:mt-16 md:[@media(min-height:36rem)]:gap-[20vh]";

/**
 * Each card sticks 14px below the last. A covered card shrinks (see the stack
 * helper), which pulls its painted panel up from 17px to about 15.6px below
 * its edge, so a 16px step would leave a hairline of painting in the strip.
 */
const STACK_ITEM_CLASS_NAME =
  "origin-top md:[@media(min-height:36rem)]:sticky md:[@media(min-height:36rem)]:top-[calc(var(--site-header-height)+2rem+var(--stack-index)*0.875rem)]";

/** Stuck cards fit the screen; `min-h-fit` lets a card grow before its copy would spill out. */
const CARD_CLASS_NAME =
  "grid gap-3 rounded-2xl border border-border bg-(--surface) p-3 md:h-104 md:min-h-fit md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-4 md:p-4 md:[@media(min-height:36rem)]:h-[min(560px,calc(100svh-var(--site-header-height)-5rem))]";

/** The painted panel takes three fifths of the card from `md` up. */
const PANEL_SIZES = "(min-width: 1248px) 690px, (min-width: 768px) 55vw, 100vw";

/** The block renders at this width, then scales down into its window. */
const BLOCK_DESIGN_WIDTH = 640;

function SampleIcon({ children }: { children: ReactNode }) {
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

/** Copy for a sample product page, the kind of page the block is dropped into. */
const SAMPLE_FEATURES: SpotlightFeature[] = [
  {
    title: "Dashboards",
    description: "Numbers update as your data does.",
    icon: (
      <SampleIcon>
        <path d="M4 19h16M7 15v-4M12 15V6M17 15V9" />
      </SampleIcon>
    ),
  },
  {
    title: "Reports",
    description: "Share one link with the whole team.",
    icon: (
      <SampleIcon>
        <rect height="18" rx="2" width="14" x="5" y="3" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </SampleIcon>
    ),
  },
  {
    title: "Alerts",
    description: "Get a ping when a number jumps.",
    icon: (
      <SampleIcon>
        <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </SampleIcon>
    ),
  },
];

/** A square tile centered on the painting, tagged with its install name. */
function TileFrame({
  registryName,
  children,
}: {
  registryName: string;
  children: ReactNode;
}) {
  return (
    <div className="relative aspect-square w-[min(84cqw,82cqh,360px)]">
      {children}
      <RegistryTag className="absolute -top-2 right-3" name={registryName} />
    </div>
  );
}

interface StackCard {
  id: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  art: Artwork;
  tile: ReactNode;
}

const CARDS: StackCard[] = [
  {
    id: "charts",
    title: "Charts that match the rest of your app",
    description:
      "Area, bar, line, pie, radar, sankey, and more. They read your theme tokens, animate in, and share parts like tooltips, legends, and brushes.",
    cta: { label: "Browse charts", href: "/charts/area-chart" },
    art: "soft-meadow-grass",
    tile: (
      <TileFrame registryName="radar-chart">
        <div
          className={cn(
            "size-full overflow-hidden rounded-xl border border-border bg-background text-foreground",
            TILE_SHADOW,
          )}
        >
          <CampaignRadarTile />
        </div>
      </TileFrame>
    ),
  },
  {
    id: "motion",
    title: "Motion with a light touch",
    description:
      "A command palette that types its own queries and a ticker that rolls to each new value. Both hold still when reduced motion is on.",
    cta: {
      label: "See Command Search",
      href: "/docs/components/command-search",
    },
    art: "pastel-daisies",
    tile: (
      <TileFrame registryName="command-search">
        {/* The palette's own corner radius, so the lift follows its edge. */}
        <div className={cn("size-full rounded-[14px]", TILE_SHADOW)}>
          <CommandPaletteTile />
        </div>
      </TileFrame>
    ),
  },
  {
    id: "blocks",
    title: "Blocks for whole sections",
    description:
      "Stat cards and feature sections you can drop into a page, then edit like any other file in your repo.",
    cta: { label: "Browse blocks", href: "/blocks" },
    art: "neutral-florals",
    tile: (
      <TileFrame registryName="feature-spotlight-grid-01">
        <AppWindow className="flex size-full flex-col" title="Landing page">
          {/* The sample page's headings are not part of this page's outline. */}
          <div aria-hidden="true" className="relative min-h-0 flex-1">
            <ScaledPreview
              className="size-full"
              designWidth={BLOCK_DESIGN_WIDTH}
            >
              {/* The block's breakpoints follow the viewport, so pin the
                  desktop layout that matches this desktop-width frame. */}
              <FeatureSpotlightGrid
                className="px-8 py-12 sm:py-12 [&_.grid]:grid-cols-3 [&_h2]:text-5xl"
                description="Dashboards, reports, and alerts for teams that check revenue every week."
                features={SAMPLE_FEATURES}
                heading="Your numbers, in one place"
              />
            </ScaledPreview>
          </div>
        </AppWindow>
      </TileFrame>
    ),
  },
];

function FeatureCard({ card }: { card: StackCard }) {
  const titleId = `why-${card.id}-title`;

  return (
    <article aria-labelledby={titleId} className={CARD_CLASS_NAME}>
      <div className="@container-size relative flex aspect-square items-center justify-center overflow-hidden rounded-xl md:aspect-auto">
        <Painting art={card.art} sizes={PANEL_SIZES} />
        {card.tile}
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-8 px-2 pt-3 pb-2 md:p-5 lg:p-8">
        <div>
          <h3
            className="text-balance font-light font-sentient text-[32px] leading-[1.15] tracking-[-0.05em] lg:text-[40px]"
            id={titleId}
          >
            {card.title}
          </h3>
          <p className="mt-4 max-w-md text-pretty text-base text-body leading-[1.45]">
            {card.description}
          </p>
        </div>
        <PrimaryLink className="self-start" href={card.cta.href}>
          {card.cta.label}
        </PrimaryLink>
      </div>
    </article>
  );
}

/**
 * Three large cards. On screens with room for a whole card, each one sticks
 * a little lower than the last, so the next card slides over it and the
 * earlier edges peek out.
 */
export function StickyFeaturesSection() {
  return (
    <section className="py-20 md:py-28" id="why">
      <Container>
        <SectionHeader badge="Why Cortexcn" lines={HEADING} />

        <StackList className={STACK_LIST_CLASS_NAME}>
          {CARDS.map((card, index) => (
            <li
              className={STACK_ITEM_CLASS_NAME}
              key={card.id}
              style={{ "--stack-index": index } as CSSProperties}
            >
              <Reveal>
                <FeatureCard card={card} />
              </Reveal>
            </li>
          ))}
        </StackList>
      </Container>
    </section>
  );
}
