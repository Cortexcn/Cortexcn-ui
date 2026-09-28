import type { ReactNode } from "react";

import { AppWindow } from "./app-window";
import { FeatureAgent } from "./features-section-agent";
import { FeatureEditor } from "./features-section-editor";
import { FeatureTerminal } from "./features-section-terminal";
import { type Artwork, Painting } from "./painting";
import { Container } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

const HEADLINE = [
  { text: "Three ways Cortexcn" },
  // The no-break space keeps "build." from sitting alone on a phone line.
  { text: "fits how you already\u00A0build.", muted: true },
];

interface Feature {
  title: string;
  description: string;
  /** Read out in place of the tile, which pictures the idea. */
  label: string;
  art: Artwork;
  window: string;
  tile: ReactNode;
}

const FEATURES: Feature[] = [
  {
    title: "Install in one command",
    description:
      "Run the shadcn CLI and the source lands in your project, with every dependency it needs.",
    label:
      "A terminal running npx shadcn@latest add @cortexcn/marquee. The CLI checks the registry, creates components/marquee.tsx, and updates app/globals.css.",
    art: "blue-cream-florals",
    window: "Terminal",
    tile: <FeatureTerminal />,
  },
  {
    title: "Own every line",
    description:
      "Nothing hides in a package. Read the code, change the styles, and ship it as yours.",
    label:
      "number-ticker.tsx open in a code editor, with the duration default changed from 0.9 to 1.4.",
    art: "white-blossoms",
    window: "acme-app",
    tile: <FeatureEditor />,
  },
  {
    title: "Built for your AI agent",
    description:
      "Give Claude Code, Cursor, or Codex the shadcn MCP server and ask for a component by name.",
    label:
      "An agent chat. Asked to add a revenue chart to the dashboard, the agent searches the registry through the shadcn MCP server, runs npx shadcn@latest add @cortexcn/area-chart, and adds the chart.",
    art: "blue-white-flowers",
    window: "Agent",
    tile: <FeatureAgent />,
  },
];

/**
 * The template's tile is a 288px square. Below that it keeps at least 24px of
 * painting on each side, and its content reflows rather than scaling down
 * (tiles query their own width to drop extras that no longer fit).
 */
const TILE_CLASS_NAME =
  "@container flex aspect-square w-[min(288px,100%_-_3rem)] flex-col";

/** How wide each panel is at each breakpoint, so the painting loads at that size. */
const PANEL_SIZES =
  "(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 md:items-center md:gap-10 lg:grid-cols-1 lg:items-stretch lg:gap-5">
      <div>
        <h3 className="text-xl leading-[1.35] tracking-[-0.02em]">
          {feature.title}
        </h3>
        <p className="mt-2 max-w-104 text-pretty text-base text-body leading-[1.45]">
          {feature.description}
        </p>
      </div>

      {/* Painted first, though the copy comes first for screen readers. */}
      <div
        aria-label={feature.label}
        className="relative order-first aspect-square overflow-hidden rounded-2xl border border-border sm:aspect-16/10 md:aspect-square xl:aspect-12/11"
        role="img"
      >
        <Painting art={feature.art} sizes={PANEL_SIZES} />
        <div className="absolute inset-0 flex items-center justify-center">
          <AppWindow className={TILE_CLASS_NAME} title={feature.window}>
            {feature.tile}
          </AppWindow>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-28" id="features">
      <Container>
        <SectionHeader badge="What you get" lines={HEADLINE} />
        <div className="mt-12 grid gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <Reveal className="min-w-0" delay={index * 120} key={feature.title}>
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
