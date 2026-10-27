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
  title: string;
  kind: "Chart" | "Cortex" | "Component";
  demo: ReactNode;
}

/** Four staggered columns of live components, each from its docs demo. */
const COLUMNS: { width: string; offset: string; cards: CanvasCard[] }[] = [
  {
    width: "w-[400px]",
    offset: "mt-0",
    cards: [
      {
        slug: "bar-chart",
        title: "Bar Chart",
        kind: "Chart",
        demo: <BarChartGradientDemo />,
      },
      {
        slug: "command-search",
        title: "Command Search",
        kind: "Cortex",
        demo: <CommandSearchDemo />,
      },
      {
        slug: "area-chart",
        title: "Area Chart",
        kind: "Chart",
        demo: <AreaChartPatternDemo />,
      },
      {
        slug: "accordion",
        title: "Accordion",
        kind: "Component",
        demo: <AccordionBasic />,
      },
    ],
  },
  {
    width: "w-[340px]",
    offset: "mt-28",
    cards: [
      {
        slug: "number-ticker",
        title: "Number Ticker",
        kind: "Cortex",
        demo: <NumberTickerDemo />,
      },
      {
        slug: "pie-chart",
        title: "Pie Chart",
        kind: "Chart",
        demo: <PieChartDonutDemo />,
      },
      {
        slug: "line-nav",
        title: "Line Nav",
        kind: "Cortex",
        demo: <LineNavDemo />,
      },
      {
        slug: "gauge-chart",
        title: "Gauge",
        kind: "Chart",
        demo: <GaugeChartDemo />,
      },
      {
        slug: "scatter-chart",
        title: "Scatter Chart",
        kind: "Chart",
        demo: <ScatterChartDemo />,
      },
    ],
  },
  {
    width: "w-[400px]",
    offset: "mt-12",
    cards: [
      {
        slug: "faq-tabs-card",
        title: "FAQ Tabs Card",
        kind: "Cortex",
        demo: <FaqTabsCardDemo />,
      },
      {
        slug: "candlestick-chart",
        title: "Candlestick Chart",
        kind: "Chart",
        demo: <CandlestickChartDemo />,
      },
      {
        slug: "logos-carousel",
        title: "Logos Carousel",
        kind: "Cortex",
        demo: <LogosCarouselDemo />,
      },
      {
        slug: "radar-chart",
        title: "Radar Chart",
        kind: "Chart",
        demo: <RadarChartBasicDemo />,
      },
      {
        slug: "work-experience",
        title: "Work Experience",
        kind: "Cortex",
        demo: <WorkExperienceDemo />,
      },
    ],
  },
  {
    width: "w-[340px]",
    offset: "mt-40",
    cards: [
      {
        slug: "ring-chart",
        title: "Ring Chart",
        kind: "Chart",
        demo: <RingChartBasicDemo />,
      },
      {
        slug: "gooey-nav",
        title: "Gooey Nav",
        kind: "Cortex",
        demo: <GooeyNavCompactDemo />,
      },
      {
        slug: "sankey-chart",
        title: "Sankey Chart",
        kind: "Chart",
        demo: <SankeyNoLabelsDemo />,
      },
      {
        slug: "live-line-chart",
        title: "Live Line Chart",
        kind: "Chart",
        demo: <LiveLineChartDemo />,
      },
      {
        slug: "sunburst-chart",
        title: "Sunburst Chart",
        kind: "Chart",
        demo: <SunburstChartDemo />,
      },
      {
        slug: "marquee",
        title: "Marquee",
        kind: "Cortex",
        demo: <MarqueeDemo />,
      },
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

/** Room around the highlighted card inside the spotlight's window. */
const SPOT_PADDING = 28;

/**
 * The veil around the spotlight, in the page's color: nearly opaque while
 * the camera rests, a little lighter while it glides so the motion reads.
 */
function spotVeil(flying: boolean) {
  const strength = flying ? 70 : 82;
  return `0 0 0 2400px color-mix(in oklab, var(--background) ${strength}%, transparent)`;
}

/** Soft edges on all four sides, so the canvas sits inside its panel. */
const PANEL_MASK: CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent, black 22%, black 80%, transparent), linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
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
 * camera rests on one card, which sits in a spotlight while the rest of the
 * wall stays under a veil, then glides to the next with a slight pull back,
 * the way a map flies between places.
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
  // The card the spotlight frames: the destination, from the moment the
  // camera sets off.
  const [target, setTarget] = useState(0);
  const [flying, setFlying] = useState(false);
  const [ready, setReady] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  // The spotlight's opening, sized to the highlighted card as it shows.
  const [spot, setSpot] = useState({ width: 0, height: 0 });

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
   * inside the spotlight.
   */
  const place = useCallback(
    (point: Point, nextScale: number) => {
      const panel = panelRef.current;
      if (!panel) {
        return;
      }
      x.set(panel.clientWidth / 2 - nextScale * point.x);
      y.set(panel.clientHeight / 2 - nextScale * point.y);
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

  // Size the spotlight to the card it frames, and follow it as it resizes.
  useLayoutEffect(() => {
    const card = cardRefs.current.get(pick(TOUR, target));
    if (!card) {
      return;
    }
    const measure = () => {
      const rest = restScale();
      setSpot({
        width: card.offsetWidth * rest,
        height: card.offsetHeight * rest,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [target, restScale]);

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
      setFlying(true);
      setTarget((focus + 1) % TOUR.length);
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
          setFlying(false);
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
        setFlying(false);
        setHighlight(focus);
        setTarget(focus);
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
                    "rounded-[20px] border p-1.5 transition-[opacity,box-shadow,border-color,filter] duration-700 ease-out motion-reduce:transition-none",
                    active
                      ? "border-foreground/15 bg-linear-to-b from-muted to-card opacity-100 shadow-[0_40px_80px_-32px_rgb(28_26_21/0.5),0_0_0_1px_rgb(255_255_255/0.04)_inset] dark:shadow-[0_40px_80px_-24px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.06)_inset]"
                      : "border-border bg-card opacity-55 saturate-75",
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
                  <div className="flex min-h-24 items-center justify-center overflow-hidden rounded-[14px] border border-border bg-background p-4 text-foreground">
                    {card.demo}
                  </div>
                  <div className="flex items-center justify-between gap-3 px-2 pt-2.5 pb-1.5">
                    <span className="truncate font-medium text-foreground text-sm">
                      {card.title}
                    </span>
                    <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                      {card.kind}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>

      {/*
       * The spotlight: a veil in the page's own color over the whole wall,
       * with a window cut to the highlighted card. It eases to each new
       * card's size, so only the card in focus reads clearly.
       */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[30px] transition-[width,height,opacity,box-shadow] duration-700 ease-out motion-reduce:transition-none"
        style={{
          width: spot.width + SPOT_PADDING,
          height: spot.height + SPOT_PADDING,
          opacity: spot.width > 0 ? 1 : 0,
          boxShadow: spotVeil(flying),
        }}
      />
    </div>
  );
}
