"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ChartExamplePreview } from "@/components/charts/chart-examples";
import { AccordionBasic } from "@/components/docs/accordion-demo";
import { CardDemo } from "@/components/docs/card-demo";
import { LineNavDemo } from "@/components/docs/line-nav-demo";
import { LogosCarouselDemo } from "@/components/docs/logos-carousel-demo";
import { MarqueeDemo } from "@/components/docs/marquee-demo";
import { PerspectiveMarqueeDemo } from "@/components/docs/perspective-marquee-demo";
import { ThemeToggleEffectDemo } from "@/components/docs/theme-toggle-effect-demo";
import { WorkExperienceDemo } from "@/components/docs/work-experience-demo";
import {
  EMBED_CHART_LOADING,
  EMBED_CHART_SLUGS,
  type EmbedDemoSlug,
} from "@/lib/embeds";

/** The docs demo for each embeddable component that is not a chart. */
const DEMOS: Record<EmbedDemoSlug, () => ReactNode> = {
  accordion: () => <AccordionBasic />,
  card: () => <CardDemo />,
  "line-nav": () => <LineNavDemo />,
  "logos-carousel": () => <LogosCarouselDemo />,
  marquee: () => <MarqueeDemo />,
  "perspective-marquee": () => <PerspectiveMarqueeDemo />,
  "theme-toggle-effect": () => <ThemeToggleEffectDemo />,
  "work-experience": () => <WorkExperienceDemo />,
};

/** The width a demo lays out at before it is scaled to fit its frame. */
const LAYOUT_WIDTH = 520;

/**
 * One component's live demo, laid out at a comfortable width and scaled down
 * to fit whatever frame it is embedded in, so it is never cut off.
 */
export function ComponentEmbed({ slug }: { slug: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ width: LAYOUT_WIDTH, scale: 1 });

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }
    const measure = () => {
      const width = Math.max(window.innerWidth, LAYOUT_WIDTH);
      const scale = Math.min(
        1,
        window.innerWidth / width,
        window.innerHeight / Math.max(content.offsetHeight, 1),
      );
      setFit((current) =>
        current.width === width && Math.abs(current.scale - scale) < 0.005
          ? current
          : { width, scale },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="flex h-svh w-full items-center justify-center overflow-hidden">
      <div
        className="flex shrink-0 items-center justify-center p-6"
        ref={contentRef}
        style={{
          width: fit.width,
          transform: `scale(${fit.scale})`,
          transformOrigin: "center",
        }}
      >
        <div className="w-full">
          <EmbedDemo slug={slug} />
        </div>
      </div>
    </div>
  );
}

/** A chart's featured example, a chart's loading state, or a docs demo. */
function EmbedDemo({ slug }: { slug: string }) {
  if (EMBED_CHART_SLUGS.has(slug)) {
    return <ChartExamplePreview chartSlug={slug} />;
  }
  const chartLoading = EMBED_CHART_LOADING.get(slug);
  if (chartLoading) {
    return (
      <ChartExamplePreview
        chartSlug={chartLoading.chart}
        exampleTitle={chartLoading.example}
      />
    );
  }
  return DEMOS[slug as EmbedDemoSlug]?.() ?? null;
}
