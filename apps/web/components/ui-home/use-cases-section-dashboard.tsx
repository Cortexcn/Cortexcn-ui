"use client";

import {
  Bar,
  BarChart,
  BarXAxis,
  ChartStatFlow,
  ChartTooltip,
  Grid,
  Legend,
  LegendItemComponent,
  type LegendItemData,
  LegendLabel,
  LegendMarker,
  LegendValue,
  Ring,
  RingCenter,
  RingChart,
  type RingData,
  useChart,
} from "@cortexcn/ui/charts";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cortexcn/ui/components/card";
import { useInView } from "motion/react";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { TrendBadge } from "@/blocks/stat-card-area-01/files/components/trend-badge";
import { cn } from "@/lib/utils";

import { AppWindow, RegistryTag } from "./app-window";

const RANGES = ["30D", "90D", "12M"];
const SELECTED_RANGE = "12M";

/** Visitors over the trailing twelve months (sample data). */
const VISITORS = [
  { month: "Oct", visitors: 16_400 },
  { month: "Nov", visitors: 17_900 },
  { month: "Dec", visitors: 15_800 },
  { month: "Jan", visitors: 19_300 },
  { month: "Feb", visitors: 20_600 },
  { month: "Mar", visitors: 19_700 },
  { month: "Apr", visitors: 22_400 },
  { month: "May", visitors: 23_900 },
  { month: "Jun", visitors: 22_800 },
  { month: "Jul", visitors: 25_300 },
  { month: "Aug", visitors: 27_100 },
  { month: "Sep", visitors: 28_600 },
];

const AVERAGE = Math.round(
  VISITORS.reduce((sum, point) => sum + point.visitors, 0) / VISITORS.length,
);

function monthOverMonth(index: number): number | null {
  const current = VISITORS[index]?.visitors;
  const previous = VISITORS[index - 1]?.visitors;
  if (current === undefined || previous === undefined) {
    return null;
  }
  return ((current - previous) / previous) * 100;
}

const LATEST_TREND = monthOverMonth(VISITORS.length - 1) ?? 0;

// One ink, three steps: the design system's charts are monochrome, and the
// steps come from the theme so they hold up on both surfaces.
const SOURCE_COLORS = [
  "var(--foreground)",
  "color-mix(in oklab, var(--foreground) 58%, var(--card))",
  "color-mix(in oklab, var(--foreground) 34%, var(--card))",
];

const THIS_MONTH_TOTAL = VISITORS.at(-1)?.visitors ?? 0;

const SOURCES: RingData[] = [
  { label: "Search", value: 14_300 },
  { label: "Social", value: 8580 },
  { label: "Direct", value: 5720 },
].map((source, index) => ({
  ...source,
  maxValue: THIS_MONTH_TOTAL,
  color: SOURCE_COLORS[index],
}));

const SOURCE_LEGEND: LegendItemData[] = SOURCES.map((source) => ({
  label: source.label,
  value: source.value,
  maxValue: source.maxValue,
  color: source.color ?? "",
}));

const BAR_FILL = "color-mix(in oklab, var(--foreground) 48%, var(--card))";

// The panel is the same white as the card under it, so it gets a hairline
// edge on top of its usual shadow-lg lift.
const TOOLTIP_PANEL_STYLE: CSSProperties = {
  boxShadow:
    "0 0 0 1px var(--border), 0 10px 15px -3px var(--shadow), 0 4px 6px -4px var(--shadow)",
};

const subscribeToNothing = () => () => undefined;

/**
 * False on the server and while hydrating, then true. ChartStatFlow formats
 * its first frame in the visitor's locale, which the server cannot know, so
 * the headline number waits for the client instead of failing hydration.
 */
function useHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/** Reports the hovered bar, so the headline number can follow the pointer. */
function HoveredBarBridge({
  onChange,
}: {
  onChange: (index: number | null) => void;
}) {
  const { tooltipData } = useChart();
  const index = tooltipData ? tooltipData.index : null;

  useEffect(() => {
    onChange(index);
  }, [index, onChange]);

  return null;
}

const cardClassName = "h-full min-h-0 gap-0 py-0";
const cardTitleClassName = "font-normal text-muted-foreground text-xs";

function VisitorsCard({ play }: { play: boolean }) {
  const hydrated = useHydrated();
  const [hovered, setHovered] = useState<number | null>(null);
  const point = hovered === null ? undefined : VISITORS[hovered];
  const trend = hovered === null ? LATEST_TREND : monthOverMonth(hovered);

  return (
    <div className="relative min-h-0">
      <Card className={cardClassName}>
        <CardHeader className="px-4 pt-3.5">
          <CardTitle className={cardTitleClassName}>Visitors</CardTitle>
          <CardAction>
            {/* The first month has nothing to compare against. */}
            {trend === null ? null : <TrendBadge value={trend} />}
          </CardAction>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col px-4 pt-0.5 pb-0">
          {/* Sized to the settled NumberFlow block, so the chart never moves. */}
          <div className="flex min-h-14 flex-col">
            {hydrated ? (
              <ChartStatFlow
                label={point ? point.month : "Monthly average"}
                labelClassName="text-xs"
                value={point ? point.visitors : AVERAGE}
                valueClassName="font-semibold text-[26px] leading-none tracking-tight"
              />
            ) : null}
          </div>
          <div className="relative -mx-2 mt-2 min-h-0 flex-1">
            {play ? (
              <BarChart
                aspectRatio="auto"
                barGap={0.46}
                className="absolute inset-0"
                data={VISITORS}
                margin={{ top: 12, right: 8, bottom: 30, left: 8 }}
                xDataKey="month"
              >
                <Grid
                  horizontal
                  numTicksRows={3}
                  strokeDasharray="none"
                  strokeOpacity={0.7}
                />
                <Bar dataKey="visitors" fill={BAR_FILL} lineCap={4} />
                <BarXAxis maxLabels={6} />
                <ChartTooltip
                  panelStyle={TOOLTIP_PANEL_STYLE}
                  rows={(datum) => [
                    {
                      color: BAR_FILL,
                      label: "Visitors",
                      value: Number(datum.visitors).toLocaleString("en-US"),
                    },
                  ]}
                  showCrosshair={false}
                  showDots={false}
                />
                <HoveredBarBridge onChange={setHovered} />
              </BarChart>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <RegistryTag className="absolute -top-2 right-3" name="bar-chart" />
    </div>
  );
}

function SourcesCard({ play }: { play: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative @md:block hidden min-h-0">
      <Card className={cardClassName}>
        <CardHeader className="px-4 pt-3.5">
          <CardTitle className={cardTitleClassName}>Traffic sources</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col justify-center gap-4 px-3 pb-3">
          <div className="flex h-41 shrink-0 items-center justify-center">
            {play ? (
              <RingChart
                baseInnerRadius={46}
                data={SOURCES}
                hoveredIndex={hovered}
                onHoverChange={setHovered}
                ringGap={4}
                size={164}
                strokeWidth={8}
              >
                {SOURCES.map((source, index) => (
                  <Ring index={index} key={source.label} showGlow={false} />
                ))}
                <RingCenter
                  defaultLabel="This month"
                  formatOptions={{
                    notation: "compact",
                    maximumFractionDigits: 1,
                  }}
                  labelClassName="whitespace-nowrap text-[10px] text-muted-foreground"
                  valueClassName="font-semibold text-lg leading-none tracking-tight"
                />
              </RingChart>
            ) : null}
          </div>
          <Legend
            className="gap-0.5"
            hoveredIndex={hovered}
            items={SOURCE_LEGEND}
            onHoverChange={setHovered}
          >
            <LegendItemComponent className="flex items-center gap-2 px-1.5 py-1">
              <LegendMarker className="size-2" />
              <LegendLabel className="flex-1 font-medium text-foreground text-xs" />
              <LegendValue
                className="text-muted-foreground text-xs tabular-nums"
                formatValue={(value) =>
                  `${Math.round((value / THIS_MONTH_TOTAL) * 100)}%`
                }
              />
            </LegendItemComponent>
          </Legend>
        </CardContent>
      </Card>
      <RegistryTag className="absolute -top-2 right-3" name="ring-chart" />
    </div>
  );
}

/**
 * An analytics screen with a live bar chart and ring chart. The charts wait
 * until the window scrolls into view, so their entrance plays where it can
 * be seen.
 */
export function UseCasesDashboardWindow() {
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(bodyRef, { once: true, amount: 0.35 });

  return (
    <AppWindow className="flex h-full flex-col" title="Analytics">
      <div
        className="@container flex min-h-0 flex-1 flex-col gap-3 bg-(--surface) p-3 sm:p-4"
        ref={bodyRef}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-sm">Overview</span>
          <span className="flex rounded-lg border border-border bg-background p-0.5 text-[11px]">
            {RANGES.map((range) => (
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-muted-foreground",
                  range === SELECTED_RANGE &&
                    "bg-muted font-medium text-foreground",
                )}
                key={range}
              >
                {range}
              </span>
            ))}
          </span>
        </div>
        <div className="grid min-h-0 flex-1 @md:grid-cols-[minmax(0,1fr)_13rem] grid-cols-1 gap-3">
          <VisitorsCard play={inView} />
          <SourcesCard play={inView} />
        </div>
      </div>
    </AppWindow>
  );
}
