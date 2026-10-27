"use client";

import { AvatarGroupWithCount } from "@cortexcn/ui/examples/avatar";
import { BadgeVariants } from "@cortexcn/ui/examples/badge";
import { ButtonGroupPagination } from "@cortexcn/ui/examples/button-group";
import { CalendarInCard } from "@cortexcn/ui/examples/calendar";
import { CommandInline } from "@cortexcn/ui/examples/command";
import { EmptyInCard } from "@cortexcn/ui/examples/empty";
import { InputOTPSimple } from "@cortexcn/ui/examples/input-otp";
import { FileUploadList } from "@cortexcn/ui/examples/progress";
import { RadioGroupWithDescriptions } from "@cortexcn/ui/examples/radio-group";
import { SwitchWithDescription } from "@cortexcn/ui/examples/switch";
import { TableWithBadges } from "@cortexcn/ui/examples/table";
import { TabsWithContent } from "@cortexcn/ui/examples/tabs";
import { ToggleGroupFilter } from "@cortexcn/ui/examples/toggle-group";
import {
  type AnimationPlaybackControls,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AccordionBasic } from "@/components/docs/accordion-demo";
import { AreaChartPatternDemo } from "@/components/docs/area-chart-pattern-demo";
import {
  BarChartGradientDemo,
  BarChartHorizontalDemo,
  BarChartStackedDemo,
} from "@/components/docs/bar-chart-demo";
import { CandlestickChartDemo } from "@/components/docs/candlestick-chart-demo";
import { ChoroplethDemo } from "@/components/docs/choropleth-demo";
import { CommandSearchDemo } from "@/components/docs/command-search-demo";
import { FanOutDiagramDemo } from "@/components/docs/fan-out-diagram-demo";
import { FaqTabsCardDemo } from "@/components/docs/faq-tabs-card-demo";
import { GaugeChartDemo } from "@/components/docs/gauge-chart-demo";
import { GooeyNavCompactDemo } from "@/components/docs/gooey-nav-demo";
import { LegendProgressDemo } from "@/components/docs/legend-demo";
import { LineChartDateRangeDemo } from "@/components/docs/line-chart-date-range-demo";
import { LineNavDemo } from "@/components/docs/line-nav-demo";
import { LiveLineChartDemo } from "@/components/docs/live-line-chart-demo";
import { LogosCarouselDemo } from "@/components/docs/logos-carousel-demo";
import { MarqueeDemo } from "@/components/docs/marquee-demo";
import { NumberTickerDemo } from "@/components/docs/number-ticker-demo";
import { PieChartDonutDemo } from "@/components/docs/pie-chart-demo";
import { ProfitLossLineDemo } from "@/components/docs/profit-loss-line-demo";
import { RadarChartBasicDemo } from "@/components/docs/radar-chart-demo";
import { RingChartBasicDemo } from "@/components/docs/ring-chart-demo";
import { SankeyNoLabelsDemo } from "@/components/docs/sankey-pattern-demo";
import { ScatterChartDemo } from "@/components/docs/scatter-chart-demo";
import { SphereMenuDemo } from "@/components/docs/sphere-menu-demo";
import { SunburstChartDemo } from "@/components/docs/sunburst-chart-demo";
import { WorkExperienceDemo } from "@/components/docs/work-experience-demo";
import { usePauseWhenOffscreen } from "@/lib/use-pause-when-offscreen";
import { cn } from "@/lib/utils";

/** How long the camera rests on a card. */
const HOLD_MS = 4400;
/** The flight between two cards, in seconds. */
const FLY_SECONDS = 2;
/** How far the camera pulls back halfway through a flight. */
const ZOOM_DIP = 0.42;
const FLY_EASE = [0.45, 0, 0.55, 1] as const;
/** The canvas zoom at rest, so a few cards show around the focused one. */
const REST_SCALE = 1.05;
/** Panels narrower than this zoom out further, down to MIN_FIT. */
const FIT_WIDTH = 780;
const MIN_FIT = 0.55;
/** How far past the wall's top or bottom the camera may show, of the panel's height. */
const EDGE_SLACK = 0.2;

interface CanvasCard {
  slug: string;
  title: string;
  kind: "Chart" | "Cortex" | "Component";
  demo: ReactNode;
}

/** Five staggered columns of live components, each from its docs demo. */
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
        slug: "calendar",
        title: "Calendar",
        kind: "Component",
        demo: <CalendarInCard />,
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
        slug: "table",
        title: "Table",
        kind: "Component",
        demo: <TableWithBadges />,
      },
      {
        slug: "accordion",
        title: "Accordion",
        kind: "Component",
        demo: <AccordionBasic />,
      },
      {
        slug: "choropleth-chart",
        title: "Choropleth Chart",
        kind: "Chart",
        demo: <ChoroplethDemo />,
      },
      {
        slug: "badge",
        title: "Badge",
        kind: "Component",
        demo: <BadgeVariants />,
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
        slug: "input-otp",
        title: "Input OTP",
        kind: "Component",
        demo: <InputOTPSimple />,
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
        slug: "switch",
        title: "Switch",
        kind: "Component",
        demo: <SwitchWithDescription />,
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
      {
        slug: "avatar",
        title: "Avatar",
        kind: "Component",
        demo: <AvatarGroupWithCount />,
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
        slug: "bar-chart-stacked",
        title: "Stacked Bar Chart",
        kind: "Chart",
        demo: <BarChartStackedDemo />,
      },
      {
        slug: "candlestick-chart",
        title: "Candlestick Chart",
        kind: "Chart",
        demo: <CandlestickChartDemo />,
      },
      {
        slug: "progress",
        title: "Progress",
        kind: "Component",
        demo: <FileUploadList />,
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
        slug: "tabs",
        title: "Tabs",
        kind: "Component",
        demo: <TabsWithContent />,
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
        slug: "toggle-group",
        title: "Toggle Group",
        kind: "Component",
        demo: <ToggleGroupFilter />,
      },
      {
        slug: "sankey-chart",
        title: "Sankey Chart",
        kind: "Chart",
        demo: <SankeyNoLabelsDemo />,
      },
      {
        slug: "radio-group",
        title: "Radio Group",
        kind: "Component",
        demo: <RadioGroupWithDescriptions />,
      },
      {
        slug: "live-line-chart",
        title: "Live Line Chart",
        kind: "Chart",
        demo: <LiveLineChartDemo />,
      },
      {
        slug: "legend",
        title: "Legend",
        kind: "Chart",
        demo: <LegendProgressDemo />,
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
  {
    width: "w-[400px]",
    offset: "mt-20",
    cards: [
      {
        slug: "profit-loss-line",
        title: "Profit/Loss Line",
        kind: "Chart",
        demo: <ProfitLossLineDemo />,
      },
      {
        slug: "fan-out-diagram",
        title: "Fan-Out Diagram",
        kind: "Cortex",
        demo: <FanOutDiagramDemo />,
      },
      {
        slug: "empty",
        title: "Empty",
        kind: "Component",
        demo: <EmptyInCard />,
      },
      {
        slug: "line-chart",
        title: "Line Chart",
        kind: "Chart",
        demo: <LineChartDateRangeDemo />,
      },
      {
        slug: "sphere-menu",
        title: "Sphere Menu",
        kind: "Cortex",
        demo: <SphereMenuDemo />,
      },
      {
        slug: "command",
        title: "Command",
        kind: "Component",
        demo: <CommandInline />,
      },
      {
        slug: "bar-chart-horizontal",
        title: "Horizontal Bar Chart",
        kind: "Chart",
        demo: <BarChartHorizontalDemo />,
      },
      {
        slug: "button-group",
        title: "Button Group",
        kind: "Component",
        demo: <ButtonGroupPagination />,
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
  "profit-loss-line",
  "calendar",
  "input-otp",
  "bar-chart-stacked",
  "gooey-nav",
  "fan-out-diagram",
  "command-search",
  "pie-chart",
  "candlestick-chart",
  "toggle-group",
  "empty",
  "area-chart",
  "line-nav",
  "progress",
  "sankey-chart",
  "line-chart",
  "table",
  "switch",
  "logos-carousel",
  "radio-group",
  "sphere-menu",
  "accordion",
  "gauge-chart",
  "radar-chart",
  "live-line-chart",
  "command",
];

function pick<T>(values: T[], index: number): T {
  return values[index % values.length] as T;
}

interface Point {
  x: number;
  y: number;
}

/**
 * The library home's hero canvas: a wall of live Cortexcn components beside
 * the hero text, dissolving into the page along its left and top edges. A
 * camera rests on one card, which shows in full while the others dim, then
 * pulls back so the whole wall lights up and flies in to the next, the way
 * a map flies between places.
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
  // While the camera flies, the whole wall lights up; at rest only the
  // highlighted card does.
  const [flying, setFlying] = useState(false);
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
   * without showing far past the wall's top or bottom edge.
   */
  const place = useCallback(
    (point: Point, nextScale: number) => {
      const panel = panelRef.current;
      const canvas = canvasRef.current;
      if (!(panel && canvas)) {
        return;
      }
      // A little empty room at either end is fine: the edges fade out there.
      const slack = panel.clientHeight * EDGE_SLACK;
      const lowest =
        panel.clientHeight - canvas.offsetHeight * nextScale - slack;
      const centeredY = panel.clientHeight / 2 - nextScale * point.y;
      x.set(panel.clientWidth / 2 - nextScale * point.x);
      y.set(Math.min(slack, Math.max(lowest, centeredY)));
      scale.set(nextScale);
    },
    [panelRef, scale, x, y],
  );

  // Some demos scroll their selected item into view, which also scrolls this
  // panel even though it hides its overflow. Undo that before it paints, so
  // the camera stays the only thing that moves the wall.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }
    const unscroll = () => {
      if (panel.scrollTop !== 0 || panel.scrollLeft !== 0) {
        panel.scrollTop = 0;
        panel.scrollLeft = 0;
      }
    };
    unscroll();
    panel.addEventListener("scroll", unscroll, { passive: true });
    return () => panel.removeEventListener("scroll", unscroll);
  }, [panelRef]);

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
      setFlying(true);
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
      className={cn("hero-wall-mask isolate overflow-hidden", className)}
      inert
      ref={panelRef}
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
            key={column.cards[0]?.slug}
          >
            {column.cards.map((card) => {
              const active = card.slug === focused;
              return (
                <div
                  className={cn(
                    "rounded-[22px] border bg-card p-2 transition-[opacity,box-shadow,border-color] duration-700 ease-out motion-reduce:transition-none",
                    active &&
                      "border-foreground/15 opacity-100 shadow-[0_40px_80px_-32px_rgb(28_26_21/0.5)] dark:shadow-[0_40px_80px_-24px_rgb(0_0_0/0.95)]",
                    !active && "border-border",
                    !active && (flying ? "opacity-75" : "opacity-30"),
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
                  <div className="flex min-h-24 items-center justify-center overflow-hidden rounded-[14px] border border-border bg-background p-5 text-foreground">
                    {card.demo}
                  </div>
                  <div className="flex items-center justify-between gap-3 px-2 pt-3 pb-1.5">
                    <span className="truncate font-medium text-foreground text-sm">
                      {card.title}
                    </span>
                    <span className="shrink-0 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[11px] text-muted-foreground">
                      {card.kind}
                    </span>
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
