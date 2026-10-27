"use client";

import {
  type AnimationPlaybackControls,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AccordionBasic } from "@/components/docs/accordion-demo";
import { AreaChartPatternDemo } from "@/components/docs/area-chart-pattern-demo";
import { BarChartGradientDemo } from "@/components/docs/bar-chart-demo";
import { CandlestickChartDemo } from "@/components/docs/candlestick-chart-demo";
import { CommandSearchDemo } from "@/components/docs/command-search-demo";
import { FaqTabsCardDemo } from "@/components/docs/faq-tabs-card-demo";
import { GaugeChartDemo } from "@/components/docs/gauge-chart-demo";
import { GooeyNavCompactDemo } from "@/components/docs/gooey-nav-demo";
import { LineNavDemo } from "@/components/docs/line-nav-demo";
import { LiveLineChartDemo } from "@/components/docs/live-line-chart-demo";
import { LogosCarouselDemo } from "@/components/docs/logos-carousel-demo";
import { MarqueeDemo } from "@/components/docs/marquee-demo";
import { NumberTickerDemo } from "@/components/docs/number-ticker-demo";
import { PieChartDonutDemo } from "@/components/docs/pie-chart-demo";
import { RadarChartBasicDemo } from "@/components/docs/radar-chart-demo";
import { RingChartBasicDemo } from "@/components/docs/ring-chart-demo";
import { SankeyNoLabelsDemo } from "@/components/docs/sankey-pattern-demo";
import { ScatterChartDemo } from "@/components/docs/scatter-chart-demo";
import { SunburstChartDemo } from "@/components/docs/sunburst-chart-demo";
import { WorkExperienceDemo } from "@/components/docs/work-experience-demo";
import { usePauseWhenOffscreen } from "@/lib/use-pause-when-offscreen";
import { cn } from "@/lib/utils";

/** How long the camera rests on a card. */
const HOLD_MS = 4400;
/** The flight between two cards, in seconds. */
const FLY_SECONDS = 2.2;
/** How far the camera pulls back halfway through a flight. */
const ZOOM_DIP = 0.24;
const FLY_EASE = [0.45, 0, 0.55, 1] as const;
/** The canvas zoom at rest, so a few cards show around the focused one. */
const REST_SCALE = 0.82;
/** Panels narrower than this zoom out further, down to MIN_FIT. */
const FIT_WIDTH = 760;
const MIN_FIT = 0.62;

interface CanvasCard {
  slug: string;
  demo: ReactNode;
}

/** Four staggered columns of live components, each from its docs demo. */
const COLUMNS: { width: string; offset: string; cards: CanvasCard[] }[] = [
  {
    width: "w-[400px]",
    offset: "mt-0",
    cards: [
      { slug: "bar-chart", demo: <BarChartGradientDemo /> },
      { slug: "command-search", demo: <CommandSearchDemo /> },
      { slug: "area-chart", demo: <AreaChartPatternDemo /> },
      { slug: "accordion", demo: <AccordionBasic /> },
    ],
  },
  {
    width: "w-[340px]",
    offset: "mt-28",
    cards: [
      { slug: "number-ticker", demo: <NumberTickerDemo /> },
      { slug: "pie-chart", demo: <PieChartDonutDemo /> },
      { slug: "line-nav", demo: <LineNavDemo /> },
      { slug: "gauge-chart", demo: <GaugeChartDemo /> },
      { slug: "scatter-chart", demo: <ScatterChartDemo /> },
    ],
  },
  {
    width: "w-[400px]",
    offset: "mt-12",
    cards: [
      { slug: "faq-tabs-card", demo: <FaqTabsCardDemo /> },
      { slug: "candlestick-chart", demo: <CandlestickChartDemo /> },
      { slug: "logos-carousel", demo: <LogosCarouselDemo /> },
      { slug: "radar-chart", demo: <RadarChartBasicDemo /> },
      { slug: "work-experience", demo: <WorkExperienceDemo /> },
    ],
  },
  {
    width: "w-[340px]",
    offset: "mt-40",
    cards: [
      { slug: "ring-chart", demo: <RingChartBasicDemo /> },
      { slug: "gooey-nav", demo: <GooeyNavCompactDemo /> },
      { slug: "sankey-chart", demo: <SankeyNoLabelsDemo /> },
      { slug: "live-line-chart", demo: <LiveLineChartDemo /> },
      { slug: "sunburst-chart", demo: <SunburstChartDemo /> },
      { slug: "marquee", demo: <MarqueeDemo /> },
    ],
  },
];

/** The cards the camera visits, in order, crossing between columns. */
const TOUR = [
  "bar-chart",
  "number-ticker",
  "faq-tabs-card",
  "ring-chart",
  "command-search",
  "pie-chart",
  "candlestick-chart",
  "sankey-chart",
  "area-chart",
  "gauge-chart",
  "radar-chart",
  "live-line-chart",
];

/** Soft edges on all four sides, so the canvas sits inside its panel. */
const PANEL_MASK: CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent, black 14%, black 86%, transparent), linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
};

function pick<T>(values: T[], index: number): T {
  return values[index % values.length] as T;
}

interface Point {
  x: number;
  y: number;
}

/**
 * The library home's hero canvas: a wall of live Cortexcn components. A
 * camera rests on one card, which comes forward in full color, then glides
 * to the next with a slight pull back, the way a map flies between places.
 * It rests while off screen, while the tab is hidden, and for visitors who
 * prefer less motion. It is decorative, so it is inert and hidden from
 * assistive technology.
 */
export function HeroCanvas({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const { ref: panelRef, paused: offscreen } = usePauseWhenOffscreen();
  const canvasRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const flyingRef = useRef(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(REST_SCALE);
  const [focus, setFocus] = useState(0);
  // The card shown in full color, which switches halfway through a flight.
  const [highlight, setHighlight] = useState(0);
  const [ready, setReady] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const running = ready && reduceMotion === false && !(offscreen || tabHidden);

  /** The canvas zoom at rest for this panel's width. */
  const restScale = useCallback(() => {
    const width = panelRef.current?.clientWidth ?? FIT_WIDTH;
    return REST_SCALE * Math.min(1, Math.max(MIN_FIT, width / FIT_WIDTH));
  }, [panelRef]);

  /** A card's center on the unscaled canvas. */
  const pointOf = useCallback(
    (slug: string): Point | null => {
      const canvas = canvasRef.current;
      const card = cardRefs.current.get(slug);
      if (!(canvas && card)) {
        return null;
      }
      const current = scale.get();
      const canvasBox = canvas.getBoundingClientRect();
      const cardBox = card.getBoundingClientRect();
      return {
        x: (cardBox.left - canvasBox.left + cardBox.width / 2) / current,
        y: (cardBox.top - canvasBox.top + cardBox.height / 2) / current,
      };
    },
    [scale],
  );

  /**
   * Moves the camera so a canvas point sits at the middle of the panel,
   * without showing past the canvas's top or bottom edge.
   */
  const place = useCallback(
    (point: Point, nextScale: number) => {
      const panel = panelRef.current;
      const canvas = canvasRef.current;
      if (!(panel && canvas)) {
        return;
      }
      const lowest = panel.clientHeight - canvas.offsetHeight * nextScale;
      const centeredY = panel.clientHeight / 2 - nextScale * point.y;
      x.set(panel.clientWidth / 2 - nextScale * point.x);
      y.set(Math.min(0, Math.max(lowest, centeredY)));
      scale.set(nextScale);
    },
    [panelRef, scale, x, y],
  );

  useEffect(() => {
    const sync = () => setTabHidden(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  // Start on the first card, and keep the current card centered while the
  // panel resizes or the charts inside settle on their size.
  const focusRef = useRef(focus);
  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!(panel && canvas)) {
      return;
    }
    const recenter = () => {
      if (flyingRef.current) {
        return;
      }
      const point = pointOf(pick(TOUR, focusRef.current));
      if (point) {
        place(point, restScale());
        setReady(true);
      }
    };
    recenter();
    const observer = new ResizeObserver(recenter);
    observer.observe(panel);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [panelRef, place, pointOf, restScale]);

  // Rest on the focused card, then glide to the next one.
  useEffect(() => {
    if (!running) {
      return;
    }
    let flight: AnimationPlaybackControls | undefined;
    let halfway: number | undefined;
    const from = pick(TOUR, focus);
    const to = pick(TOUR, focus + 1);
    const timer = window.setTimeout(() => {
      const start = pointOf(from);
      const end = pointOf(to);
      if (!(start && end)) {
        return;
      }
      const rest = restScale();
      flyingRef.current = true;
      flight = animate(0, 1, {
        duration: FLY_SECONDS,
        ease: FLY_EASE,
        onUpdate: (progress) => {
          place(
            {
              x: start.x + (end.x - start.x) * progress,
              y: start.y + (end.y - start.y) * progress,
            },
            rest * (1 - ZOOM_DIP * Math.sin(Math.PI * progress)),
          );
        },
        onComplete: () => {
          flyingRef.current = false;
          setFocus((current) => (current + 1) % TOUR.length);
        },
      });
      // The next card comes forward halfway there.
      halfway = window.setTimeout(
        () => setHighlight((focus + 1) % TOUR.length),
        (FLY_SECONDS * 1000) / 2,
      );
    }, HOLD_MS);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(halfway);
      if (flyingRef.current && flight) {
        // Paused mid-flight: settle back on the card it left.
        flight.stop();
        flyingRef.current = false;
        setHighlight(focus);
        const point = pointOf(from);
        if (point) {
          place(point, restScale());
        }
      }
    };
  }, [focus, place, pointOf, restScale, running]);

  const focused = pick(TOUR, highlight);

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
      inert
      ref={panelRef}
      style={PANEL_MASK}
    >
      <motion.div
        className={cn(
          "absolute top-0 left-0 flex items-start gap-8 p-10 transition-opacity duration-700 motion-reduce:transition-none",
          ready ? "opacity-100" : "opacity-0",
        )}
        ref={canvasRef}
        style={{ x, y, scale, transformOrigin: "0 0" }}
      >
        {COLUMNS.map((column) => (
          <div
            className={cn(
              "flex shrink-0 flex-col gap-8",
              column.width,
              column.offset,
            )}
            key={column.width + column.offset}
          >
            {column.cards.map((card) => {
              const active = card.slug === focused;
              return (
                <div
                  className={cn(
                    "rounded-2xl border border-border bg-muted/70 p-1.5 transition-[opacity,box-shadow,filter] duration-700 ease-out motion-reduce:transition-none",
                    active
                      ? "opacity-100 shadow-[0_32px_64px_-28px_rgb(28_26_21/0.45),0_2px_6px_rgb(28_26_21/0.06)] dark:shadow-[0_32px_64px_-28px_rgb(0_0_0/0.85)]"
                      : "opacity-35 saturate-50",
                  )}
                  key={card.slug}
                  ref={(element) => {
                    if (element) {
                      cardRefs.current.set(card.slug, element);
                    } else {
                      cardRefs.current.delete(card.slug);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 px-2.5 pt-1 pb-2 font-mono text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-current" />
                    <span>
                      <span className="opacity-60">@cortexcn/</span>
                      {card.slug}
                    </span>
                  </div>
                  <div className="flex min-h-24 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-4 text-card-foreground">
                    {card.demo}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
