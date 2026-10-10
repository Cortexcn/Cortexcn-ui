import type { ComponentType } from "react";
import type { ComponentGroup } from "@/lib/component-families";
import { cn } from "@/lib/utils";

/** Rounds to one decimal so the SVG markup stays short. */
function round(value: number) {
  return Math.round(value * 10) / 10;
}

const CENTER_X = 100;
const CENTER_Y = 60;
const STREAK_COUNT = 28;

/** Light streaks flying out of a vanishing point, like the Light Speed background. */
const STREAKS = Array.from({ length: STREAK_COUNT }, (_, index) => {
  const angle = (index / STREAK_COUNT) * Math.PI * 2 + (index % 3) * 0.08;
  const start = 8 + ((index * 7) % 11) * 2;
  const end = start + 26 + ((index * 13) % 17) * 3;
  return {
    id: `streak-${index}`,
    x1: round(CENTER_X + Math.cos(angle) * start),
    y1: round(CENTER_Y + Math.sin(angle) * start * 0.62),
    x2: round(CENTER_X + Math.cos(angle) * end),
    y2: round(CENTER_Y + Math.sin(angle) * end * 0.62),
    opacity: round(0.3 + ((index * 5) % 7) / 10),
  };
});

/** Logo tiles in a marquee strip, fading toward both edges. */
const MARQUEE_TILES = [14, 44, 74, 104, 134, 164].map((x) => ({
  x,
  opacity: round(1 - Math.abs(x + 11 - CENTER_X) / 110),
}));

const CHART_LINE = "M12 66L40 56L68 60L96 40L124 46L152 28L188 22";
const CHART_GRID = [20, 40, 60, 80];
const CHART_BARS = [
  { x: 24, height: 8 },
  { x: 48, height: 13 },
  { x: 72, height: 6 },
  { x: 96, height: 16 },
  { x: 120, height: 11 },
  { x: 144, height: 18 },
  { x: 168, height: 10 },
];

function ComponentsArt() {
  return (
    <>
      {/* Button */}
      <rect className="fill-foreground" height="18" width="58" x="18" y="18" />
      <rect className="fill-background" height="3" width="30" x="32" y="25.5" />
      {/* Toggle group */}
      <rect
        className="fill-background stroke-border"
        height="17"
        width="48"
        x="86.5"
        y="18.5"
      />
      <rect className="fill-muted" height="15" width="15" x="87.5" y="19.5" />
      <path className="stroke-border" d="M103 19v16M119 19v16" />
      {/* Switch, on */}
      <rect className="fill-foreground" height="16" width="32" x="146" y="19" />
      <rect className="fill-background" height="12" width="13" x="163" y="21" />
      {/* Input */}
      <rect
        className="fill-background stroke-border"
        height="18"
        width="124"
        x="18.5"
        y="48.5"
      />
      <rect
        className="fill-muted-foreground/40"
        height="3"
        width="44"
        x="28"
        y="56"
      />
      <rect className="fill-foreground" height="10" width="1.5" x="76" y="52" />
      {/* Select */}
      <rect
        className="fill-background stroke-border"
        height="18"
        width="30"
        x="148.5"
        y="48.5"
      />
      <path
        className="stroke-muted-foreground"
        d="M159 56l4 4 4-4"
        strokeWidth="1.4"
      />
      {/* Checkbox, checked */}
      <rect className="fill-foreground" height="12" width="12" x="18" y="82" />
      <path
        className="stroke-background"
        d="M21 88l2.5 2.5L27.5 85"
        strokeWidth="1.6"
      />
      <rect
        className="fill-muted-foreground/40"
        height="3"
        width="40"
        x="38"
        y="86.5"
      />
      {/* Slider */}
      <rect
        className="fill-muted-foreground/30"
        height="3"
        width="80"
        x="98"
        y="86.5"
      />
      <rect className="fill-foreground" height="3" width="46" x="98" y="86.5" />
      <rect
        className="fill-background stroke-foreground"
        height="12"
        width="12"
        x="138.5"
        y="82"
      />
    </>
  );
}

function CortexArt() {
  return (
    <>
      {/* Lanyard strap and clip */}
      <path
        className="stroke-muted-foreground/60"
        d="M86 0L97 30M114 0L103 30"
        strokeWidth="3"
      />
      <rect className="fill-foreground" height="6" width="10" x="95" y="28" />
      {/* Badge */}
      <g transform="rotate(-6 100 56)">
        <rect
          className="fill-background stroke-foreground"
          height="44"
          width="38"
          x="81"
          y="34"
        />
        <rect
          className="fill-foreground"
          height="13"
          width="13"
          x="87"
          y="40"
        />
        <rect
          className="fill-muted-foreground/50"
          height="3"
          width="22"
          x="87"
          y="59"
        />
        <rect
          className="fill-muted-foreground/30"
          height="3"
          width="15"
          x="87"
          y="66"
        />
      </g>
      {/* Marquee strip */}
      <rect className="fill-muted" height="22" width="200" x="0" y="88" />
      {MARQUEE_TILES.map((tile) => (
        <rect
          className="fill-foreground"
          height="10"
          key={tile.x}
          opacity={tile.opacity}
          width="22"
          x={tile.x}
          y="94"
        />
      ))}
    </>
  );
}

function BackgroundsArt() {
  return (
    <>
      <rect
        className="fill-foreground dark:fill-background"
        height="120"
        width="200"
      />
      {STREAKS.map((streak) => (
        <line
          className="stroke-background dark:stroke-foreground"
          key={streak.id}
          opacity={streak.opacity}
          strokeLinecap="square"
          strokeWidth="1.4"
          x1={streak.x1}
          x2={streak.x2}
          y1={streak.y1}
          y2={streak.y2}
        />
      ))}
    </>
  );
}

function ChartsArt() {
  return (
    <>
      {CHART_GRID.map((y) => (
        <line
          className="stroke-border"
          key={y}
          strokeDasharray="2 3"
          x1="12"
          x2="188"
          y1={y}
          y2={y}
        />
      ))}
      <path className="fill-foreground/10" d={`${CHART_LINE}V84H12Z`} />
      <path className="stroke-foreground" d={CHART_LINE} strokeWidth="1.8" />
      {/* Crosshair on the hovered point */}
      <line
        className="stroke-muted-foreground/60"
        x1="152"
        x2="152"
        y1="12"
        y2="112"
      />
      <rect
        className="fill-background stroke-foreground"
        height="7"
        width="7"
        x="148.5"
        y="24.5"
      />
      {CHART_BARS.map((bar) => (
        <rect
          className="fill-muted-foreground/40"
          height={bar.height}
          key={bar.x}
          width="10"
          x={bar.x - 5}
          y={112 - bar.height}
        />
      ))}
    </>
  );
}

const ART: Record<ComponentGroup["category"], ComponentType> = {
  components: ComponentsArt,
  cortex: CortexArt,
  backgrounds: BackgroundsArt,
  charts: ChartsArt,
};

/** A small drawing of what a component family holds, in the theme's colors. */
export function ComponentFamilyArt({
  category,
  className,
}: {
  category: ComponentGroup["category"];
  className?: string;
}) {
  const Art = ART[category];
  return (
    <svg
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
      fill="none"
      viewBox="0 0 200 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Art />
    </svg>
  );
}
