"use client";

import { Marquee } from "@bklitui/ui/components/marquee";
import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";

import { usePauseWhenOffscreen } from "@/lib/use-pause-when-offscreen";
import { cn } from "@/lib/utils";

import { DotTexture, PixelArt, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

interface Capability {
  title: string;
  tags: [string, string];
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    title: "Component registry",
    tags: ["Registry", "shadcn"],
    description:
      "Charts, blocks, and UI components in one registry, each with docs, live examples, and an install command.",
  },
  {
    title: "Agent ready",
    tags: ["MCP", "Agents"],
    description:
      "Point Claude Code, Cursor, or Codex at the registry. Your agent finds the right component and installs it.",
  },
  {
    title: "Ships as your code",
    tags: ["React", "Tailwind"],
    description:
      "Components copy into your repo as plain React and Tailwind, so you can change anything you like.",
  },
];

/* ------------------------------------------------------------------------ */
/* Diagram: registry -> Cortexcn -> agents, and down into your app.          */
/* ------------------------------------------------------------------------ */

type IconName =
  | "chart"
  | "blocks"
  | "square"
  | "hook"
  | "terminal"
  | "pointer"
  | "spark"
  | "code"
  | "layout"
  | "bag";

/** 14 x 14 line icons for the diagram rows. */
const ICON_PATHS: Record<IconName, string> = {
  chart: "M1.5 12.5h11M3.5 10V6.5M7 10V3.5M10.5 10V8",
  blocks:
    "M1.5 1.5h4.5v4.5H1.5zM8 1.5h4.5v4.5H8zM1.5 8h4.5v4.5H1.5zM8 8h4.5v4.5H8z",
  square: "M1.5 1.5h11v11h-11zM1.5 5h11",
  hook: "M5.5 8.5l3-3M4 7l-1.5 1.5a2.1 2.1 0 0 0 3 3L7 10M10 7l1.5-1.5a2.1 2.1 0 0 0-3-3L7 4",
  terminal: "M1.5 2.5h11v9h-11zM4 5.5l2 1.5-2 1.5M7.5 9h2.5",
  pointer: "M3 1.5v10l2.6-2.4 1.8 3.9 1.7-.8-1.8-3.8H11z",
  spark:
    "M7 1.5v3M7 9.5v3M1.5 7h3M9.5 7h3M3.2 3.2l2 2M8.8 8.8l2 2M10.8 3.2l-2 2M5.2 8.8l-2 2",
  code: "M4.5 4L1.5 7l3 3M9.5 4l3 3-3 3M8 2.5l-2 9",
  layout: "M1.5 1.5h11v11h-11zM1.5 5h11M5 5v7.5",
  bag: "M2.5 4.5h9l-.8 8h-7.4zM5 4.5V3.5a2 2 0 0 1 4 0v1",
};

function DiagramIcon({
  name,
  x,
  y,
  size = 14,
  className,
}: {
  name: IconName;
  x: number;
  y: number;
  size?: number;
  className?: string;
}) {
  return (
    <path
      className={className}
      d={ICON_PATHS[name]}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.1}
      transform={`translate(${x} ${y}) scale(${size / 14})`}
    />
  );
}

interface DiagramRow {
  label: string;
  icon: IconName;
}

const REGISTRY_ROWS: DiagramRow[] = [
  { label: "Charts", icon: "chart" },
  { label: "Blocks", icon: "blocks" },
  { label: "UI", icon: "square" },
  { label: "Hooks", icon: "hook" },
];

const AGENT_ROWS: DiagramRow[] = [
  { label: "Claude Code", icon: "terminal" },
  { label: "Cursor", icon: "pointer" },
  { label: "Codex", icon: "spark" },
  { label: "VS Code", icon: "code" },
];

const APP_TILES: IconName[] = ["layout", "chart", "bag"];

const DIM_STROKE = "stroke-[color-mix(in_oklab,var(--border)_70%,transparent)]";

function DiagramBox({
  x,
  title,
  rows,
  active,
  highlight,
}: {
  x: number;
  title: string;
  rows: DiagramRow[];
  active: boolean;
  highlight: number;
}) {
  return (
    <g>
      <rect
        className={cn(
          "fill-background transition-[stroke] duration-500",
          active ? "stroke-primary" : DIM_STROKE,
        )}
        height={249}
        width={151}
        x={x + 0.5}
        y={0.5}
      />
      <text
        className={cn(
          "font-medium font-mono uppercase transition-[fill] duration-500",
          active ? "fill-foreground" : "fill-muted-foreground",
        )}
        fontSize={12}
        letterSpacing="-0.04em"
        x={x + 17}
        y={31}
      >
        {title}
      </text>
      {rows.map((row, index) => {
        const top = 48 + index * 39;
        const lit = active && index === highlight;
        return (
          <g
            className={cn(
              "transition-colors duration-300",
              lit ? "text-foreground" : "text-muted-foreground",
            )}
            key={row.label}
          >
            <DiagramIcon name={row.icon} x={x + 17} y={top + 10} />
            <text
              className="fill-current"
              fontSize={14}
              letterSpacing="-0.05em"
              x={x + 40}
              y={top + 22}
            >
              {row.label}
            </text>
            <line
              className={DIM_STROKE}
              x1={x + 17}
              x2={x + 134}
              y1={top + 36.5}
              y2={top + 36.5}
            />
          </g>
        );
      })}
    </g>
  );
}

/** A connector that runs dim, or flows toward its target when active. */
function Connector({ d, active }: { d: string; active: boolean }) {
  return (
    <>
      <path className={DIM_STROKE} d={d} fill="none" />
      <path
        className={cn(
          "animate-dash-flow stroke-primary transition-opacity duration-500 motion-reduce:animate-none",
          active ? "opacity-100" : "opacity-0",
        )}
        d={d}
        fill="none"
        strokeDasharray="4 4"
        strokeWidth={1.5}
      />
    </>
  );
}

function CapabilityDiagram({
  active,
  highlight,
}: {
  active: number;
  highlight: number;
}) {
  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full max-w-132"
      viewBox="0 0 528 442"
      xmlns="http://www.w3.org/2000/svg"
    >
      <DiagramBox
        active={active === 0}
        highlight={highlight}
        rows={REGISTRY_ROWS}
        title="Registry"
        x={0}
      />
      <DiagramBox
        active={active === 1}
        highlight={highlight}
        rows={AGENT_ROWS}
        title="Agents"
        x={376}
      />

      {/* Brackets from each box into the Cortexcn tile. */}
      <Connector
        active={active === 0}
        d="M152 30.5h29.5v189H152M181.5 124.5H217"
      />
      <Connector
        active={active === 1}
        d="M376 30.5h-29.5v189H376M346.5 124.5H311"
      />
      {/* Twin lines down into your app. */}
      <Connector active={active === 2} d="M261.5 171v147M267.5 171v147" />

      <rect
        className="fill-[#0a0a0a] stroke-[color-mix(in_oklab,var(--border)_70%,transparent)]"
        height={94}
        width={94}
        x={217.5}
        y={77.5}
      />
      <image
        height={40}
        href="/img/cortexcn/icon-dark.png"
        width={40}
        x={244.5}
        y={104.5}
      />

      <g>
        <rect
          className={cn(
            "fill-background transition-[stroke] duration-500",
            active === 2 ? "stroke-primary" : DIM_STROKE,
          )}
          height={123}
          width={300}
          x={114.5}
          y={318.5}
        />
        <text
          className={cn(
            "font-medium font-mono uppercase transition-[fill] duration-500",
            active === 2 ? "fill-foreground" : "fill-muted-foreground",
          )}
          fontSize={12}
          letterSpacing="-0.04em"
          textAnchor="middle"
          x={264.5}
          y={346}
        >
          Your app
        </text>
        {APP_TILES.map((icon, index) => {
          const x = 164 + index * 74;
          const lit = active === 2 && index === highlight % APP_TILES.length;
          return (
            <g
              className={cn(
                "transition-colors duration-300",
                lit ? "text-primary" : "text-muted-foreground",
              )}
              key={icon}
            >
              <rect
                className={cn(
                  "fill-background transition-[stroke] duration-300",
                  lit ? "stroke-primary" : DIM_STROKE,
                )}
                height={52}
                width={52}
                x={x + 0.5}
                y={362.5}
              />
              <DiagramIcon name={icon} size={20} x={x + 16} y={378} />
            </g>
          );
        })}
        {[146, 230, 304, 386].map((x, index) => (
          <rect
            className="fill-muted-foreground"
            height={index === 0 || index === 3 ? 6 : 4}
            key={x}
            width={index === 0 || index === 3 ? 6 : 4}
            x={index === 0 || index === 3 ? x - 1 : x}
            y={index === 0 || index === 3 ? 386 : 387}
          />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Tabs                                                                      */
/* ------------------------------------------------------------------------ */

function CapabilityTab({
  capability,
  index,
  selected,
  onSelect,
}: {
  capability: Capability;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-controls="capability-diagram"
      aria-selected={selected}
      className={cn(
        "flex w-full flex-col gap-1.5 text-left outline-none transition-opacity duration-300 focus-visible:ring-2 focus-visible:ring-ring/50",
        selected ? "opacity-100" : "opacity-30 hover:opacity-60",
      )}
      onClick={onSelect}
      role="tab"
      type="button"
    >
      <span
        className={cn(
          "flex gap-2 transition-opacity duration-300",
          selected ? "opacity-100" : "opacity-0",
        )}
      >
        {capability.tags.map((tag) => (
          <span
            className="bg-primary px-0.5 font-medium font-mono text-primary-foreground text-sm uppercase leading-[1.3] tracking-[-0.04em]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </span>
      <span className="flex items-center">
        <span
          aria-hidden="true"
          className={cn(
            "size-2 shrink-0 bg-primary transition-[margin,opacity,width] duration-300",
            selected ? "mr-2 w-2 opacity-100" : "mr-0 w-0 opacity-0",
          )}
        />
        <span className="shrink-0 text-2xl leading-[1.3] tracking-[-0.05em]">
          {capability.title}
        </span>
        <span
          aria-hidden="true"
          className="mx-2 h-px min-w-6 flex-1 border-border border-b border-dashed"
        />
        <span className="shrink-0 text-base leading-[1.3] tracking-[-0.05em]">
          {`// ${String(index + 1).padStart(3, "0")}`}
        </span>
      </span>
      <span
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
          selected
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <span className="overflow-hidden">
          <span className="block max-w-105 pt-2 text-base text-body leading-[1.3] tracking-[-0.05em]">
            {capability.description}
          </span>
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* Bottom cards                                                              */
/* ------------------------------------------------------------------------ */

const TICKER_LOGOS = [
  { name: "Next.js", slug: "nextjs", ratio: 1, label: true },
  { name: "React", slug: "react", ratio: 600 / 180.32, label: false },
  { name: "Tailwind CSS", slug: "tailwindcss", ratio: 262 / 33, label: false },
  { name: "shadcn/ui", slug: "shadcn", ratio: 1, label: true },
  { name: "Vercel", slug: "vercel", ratio: 262 / 52, label: false },
  { name: "Cursor", slug: "cursor", ratio: 466.73 / 532.09, label: true },
  { name: "Claude", slug: "claude", ratio: 512 / 110, label: false },
  { name: "OpenAI", slug: "openai", ratio: 956.9 / 260.8, label: false },
];

function TickerLogo({ logo }: { logo: (typeof TICKER_LOGOS)[number] }) {
  const height = logo.label ? 18 : 16;
  return (
    <div className="flex h-12 w-37.5 shrink-0 items-center justify-center gap-2 border border-border opacity-70 grayscale">
      <Image
        alt={logo.label ? "" : logo.name}
        height={height}
        src={`/logos/stack/${logo.slug}-dark.svg`}
        style={{ height, width: "auto", maxWidth: 110 }}
        unoptimized
        width={Math.round(height * logo.ratio)}
      />
      {logo.label ? (
        <span className="whitespace-nowrap font-semibold text-foreground text-sm tracking-tight">
          {logo.name}
        </span>
      ) : null}
    </div>
  );
}

/** Square frames drawn back to front; each one hides what is behind it. */
function frameRows(
  size: number,
  frames: [x: number, y: number, width: number, height: number][],
  thickness = 2,
) {
  const grid = Array.from({ length: size }, () =>
    new Array<string>(size).fill("."),
  );
  for (const [x, y, width, height] of frames) {
    for (let row = y; row < y + height; row += 1) {
      for (let column = x; column < x + width; column += 1) {
        const edge =
          row < y + thickness ||
          row >= y + height - thickness ||
          column < x + thickness ||
          column >= x + width - thickness;
        const line = grid[row];
        if (line) {
          line[column] = edge ? "#" : ".";
        }
      }
    }
  }
  return grid.map((line) => line.join(""));
}

const SQUARE_ROWS = frameRows(14, [[0, 0, 14, 14]]);
const STACKED_ROWS = frameRows(14, [
  [4, 0, 10, 10],
  [0, 4, 10, 10],
]);

function InfoCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col gap-8 bg-background p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-2xl leading-[1.3] tracking-[-0.05em]">
          {title}
        </h3>
        <p className="max-w-110 text-base text-body leading-[1.3] tracking-[-0.05em]">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

const HIGHLIGHT_MS = 900;

export function CapabilitiesSection() {
  const [active, setActive] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const { ref, paused } = usePauseWhenOffscreen<HTMLElement>();

  // Rows in the active box light up one after another.
  useEffect(() => {
    if (paused) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setHighlight((current) => (current + 1) % 4);
    }, HIGHLIGHT_MS);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      aria-label="Core capabilities"
      className="band-dark dark w-full bg-background py-20 text-foreground"
      ref={ref}
    >
      <Container>
        <div className="grid border-border border-b lg:grid-cols-2">
          <div className="flex flex-col gap-12 pb-12 lg:gap-16 lg:pb-20">
            <SectionLabel label="Core capabilities" section="capabilities" />
            <div className="flex flex-col gap-6 lg:pr-12" role="tablist">
              {CAPABILITIES.map((capability, index) => (
                <CapabilityTab
                  capability={capability}
                  index={index}
                  key={capability.title}
                  onSelect={() => {
                    setActive(index);
                    setHighlight(0);
                  }}
                  selected={active === index}
                />
              ))}
            </div>
            <TypeHeading
              className="mt-auto text-foreground"
              lines={["Components in.", "Finished pages out."]}
            />
          </div>

          <div
            className="relative flex min-h-105 items-center justify-center overflow-hidden border-border border-t bg-card px-6 py-12 sm:px-9 lg:mt-2.25 lg:border-l"
            id="capability-diagram"
            role="tabpanel"
          >
            <DotTexture className="bg-[color-mix(in_oklab,var(--foreground)_12%,transparent)]" />
            <div className="relative w-full max-w-132">
              <CapabilityDiagram active={active} highlight={highlight} />
            </div>
          </div>
        </div>

        {/* Keeps the center line running into the cards below. */}
        <div aria-hidden="true" className="relative h-8">
          <span className="absolute inset-y-0 left-1/2 hidden w-px bg-border lg:block" />
        </div>

        <div className="grid gap-px border border-border bg-border lg:grid-cols-[2fr_1fr_1fr]">
          <InfoCard
            className="overflow-hidden"
            description="Next.js, React, Tailwind, and the AI tools you already use."
            title="Works with your stack"
          >
            <div className="-mx-6 mt-auto flex flex-col gap-2">
              <Marquee
                className="p-0 [--duration:40s] [--gap:0.5rem]"
                pauseOnHover
                repeat={3}
              >
                {TICKER_LOGOS.map((logo) => (
                  <TickerLogo key={logo.slug} logo={logo} />
                ))}
              </Marquee>
              <Marquee
                className="p-0 [--duration:46s] [--gap:0.5rem]"
                pauseOnHover
                repeat={3}
                reverse
              >
                {[...TICKER_LOGOS].reverse().map((logo) => (
                  <TickerLogo key={logo.slug} logo={logo} />
                ))}
              </Marquee>
            </div>
          </InfoCard>
          <InfoCard
            description="Install only the parts you use. Nothing ships that you did not add."
            title="Small by default"
          >
            <PixelArt
              className="mt-auto size-14 self-end text-faint"
              rows={SQUARE_ROWS}
            />
          </InfoCard>
          <InfoCard
            description="Start with one chart. Add blocks and full pages as the product grows."
            title="Grows with you"
          >
            <PixelArt
              className="mt-auto size-14 self-end text-faint"
              rows={STACKED_ROWS}
            />
          </InfoCard>
        </div>
      </Container>
    </section>
  );
}
