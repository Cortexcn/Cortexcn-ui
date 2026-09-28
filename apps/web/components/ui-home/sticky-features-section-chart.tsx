"use client";

import {
  Legend,
  LegendItemComponent,
  type LegendItemData,
  LegendLabel,
  LegendMarker,
  LegendValue,
  RadarArea,
  RadarAxis,
  RadarChart,
  type RadarChartProps,
  type RadarData,
  RadarGrid,
  RadarLabels,
  type RadarMetric,
} from "@bklitui/ui/charts";
import { useInView, useReducedMotion } from "motion/react";
import { type CSSProperties, useRef, useState } from "react";

/** Short labels, so the side ones still fit when the tile is phone sized. */
const METRICS: RadarMetric[] = [
  { key: "reach", label: "Reach" },
  { key: "clicks", label: "Clicks" },
  { key: "signups", label: "Signups" },
  { key: "retention", label: "Retention" },
  { key: "sales", label: "Sales" },
];

/** Sample scores out of 100 for the mock widget. */
const PERIODS: RadarData[] = [
  {
    label: "This month",
    color: "var(--chart-1)",
    values: { reach: 82, clicks: 74, signups: 68, retention: 79, sales: 72 },
  },
  {
    label: "Last month",
    color: "var(--chart-2)",
    values: { reach: 64, clicks: 71, signups: 52, retention: 60, sales: 58 },
  },
];

const averageScore = (values: Record<string, number>) => {
  const scores = Object.values(values);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const LEGEND_ITEMS: LegendItemData[] = PERIODS.map((period) => ({
  label: period.label,
  value: Math.round(averageScore(period.values)),
  maxValue: 100,
  color: period.color ?? "",
}));

/** Last month first, so this month's outline sits on top. */
const DRAW_ORDER = PERIODS.map((period, index) => ({
  label: period.label,
  index,
})).reverse();

/**
 * The chart and legend variables pointed at the page's own tokens, the same
 * way an app would theme them, so the widget follows light and dark mode.
 */
const CHART_THEME = {
  "--chart-1": "var(--foreground)",
  "--chart-2": "color-mix(in oklab, var(--foreground) 45%, var(--background))",
  "--chart-background": "var(--background)",
  "--chart-label": "var(--muted-foreground)",
  "--legend-foreground": "var(--foreground)",
  "--legend-muted": "var(--muted)",
  "--legend-muted-foreground": "var(--muted-foreground)",
} as CSSProperties;

/**
 * With reduced motion the chart draws its final state at once. The enter
 * duration scales every stagger and delay, so zero removes them all.
 */
const STILL_CHART = {
  animate: false,
  enterDurationMs: 0,
  enterTransition: { duration: 0 },
} satisfies Partial<RadarChartProps>;

/**
 * A campaign widget: a radar chart and its legend sharing one hover state.
 * The chart mounts once the widget is in view, so its entrance plays where
 * people can see it.
 */
export function CampaignRadarTile() {
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartAreaRef, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className="@container flex size-full flex-col gap-2 p-4"
      style={CHART_THEME}
    >
      <div className="flex items-baseline justify-between gap-3 px-1">
        <span className="truncate font-medium text-sm tracking-[-0.01em]">
          Campaign performance
        </span>
        <span className="@[18rem]:inline hidden shrink-0 text-muted-foreground text-xs">
          Scores out of 100
        </span>
      </div>

      <div className="relative min-h-0 flex-1" ref={chartAreaRef}>
        <div className="absolute inset-0 flex items-center justify-center">
          {/* A pentagon's lower points sit higher than its top one, so nudge
              the square down to center what is drawn. */}
          <div className="aspect-square h-full translate-y-[4%]">
            {inView ? (
              <RadarChart
                data={PERIODS}
                hoveredIndex={hoveredIndex}
                levels={4}
                margin={28}
                metrics={METRICS}
                onHoverChange={setHoveredIndex}
                {...(reduceMotion ? STILL_CHART : {})}
              >
                <RadarGrid showLabels={false} />
                <RadarAxis />
                <RadarLabels offset={14} />
                {DRAW_ORDER.map(({ label, index }) => (
                  <RadarArea index={index} key={label} showGlow={false} />
                ))}
              </RadarChart>
            ) : null}
          </div>
        </div>
      </div>

      <Legend
        className="flex-row justify-center gap-1"
        hoveredIndex={hoveredIndex}
        items={LEGEND_ITEMS}
        onHoverChange={setHoveredIndex}
      >
        <LegendItemComponent className="flex items-center gap-2 px-2 py-1">
          <LegendMarker className="size-2" />
          <LegendLabel className="font-medium text-xs" />
          {/* On a small tile the labels need the room. */}
          <LegendValue className="@[18rem]:flex hidden text-xs tabular-nums" />
        </LegendItemComponent>
      </Legend>
    </div>
  );
}
