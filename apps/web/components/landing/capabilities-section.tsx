"use client";

import { Marquee } from "@cortexcn/ui/components/marquee";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { useSmoothScrollTo } from "@/components/smooth-scroll/use-smooth-scroll-to";
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

type IconName = "chart" | "blocks" | "square" | "hook" | "spark" | "example";

/** 14 x 14 line icons for the registry rows. */
const ICON_PATHS: Record<IconName, string> = {
  chart: "M1.5 12.5h11M3.5 10V6.5M7 10V3.5M10.5 10V8",
  blocks:
    "M1.5 1.5h4.5v4.5H1.5zM8 1.5h4.5v4.5H8zM1.5 8h4.5v4.5H1.5zM8 8h4.5v4.5H8z",
  square: "M1.5 1.5h11v11h-11zM1.5 5h11",
  hook: "M5.5 8.5l3-3M4 7l-1.5 1.5a2.1 2.1 0 0 0 3 3L7 10M10 7l1.5-1.5a2.1 2.1 0 0 0-3-3L7 4",
  spark: "M7 1.5l1.4 3.6 3.6 1.4-3.6 1.4L7 11.5 5.6 7.9 2 6.5l3.6-1.4z",
  example: "M3 1.5h5.5L11 4v8.5H3zM8.5 1.5V4H11M5 7h4M5 9.5h2.5",
};

function DiagramIcon({ name, x, y }: { name: IconName; x: number; y: number }) {
  return (
    <path
      d={ICON_PATHS[name]}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.1}
      transform={`translate(${x} ${y})`}
    />
  );
}

/** A row shows a line icon (registry kinds) or a real logo (agents). */
type DiagramRow = { label: string } & ({ icon: IconName } | { logo: string });

const REGISTRY_ROWS: DiagramRow[] = [
  { label: "Charts", icon: "chart" },
  { label: "Blocks", icon: "blocks" },
  { label: "UI", icon: "square" },
  { label: "Hooks", icon: "hook" },
  { label: "Effects", icon: "spark" },
  { label: "Examples", icon: "example" },
];

const AGENT_ROWS: DiagramRow[] = [
  { label: "Claude Code", logo: "/logos/claude.svg" },
  { label: "Cursor", logo: "/logos/cursor-dark.svg" },
  { label: "Codex", logo: "/logos/openai-dark.svg" },
  { label: "VS Code", logo: "/logos/stack/vscode.svg" },
  { label: "OpenCode", logo: "/logos/opencode-dark.svg" },
  { label: "Windsurf", logo: "/logos/windsurf-dark.svg" },
];

const APP_TILES = [
  { name: "Next.js", logo: "/logos/stack/nextjs-dark.svg" },
  { name: "React", logo: "/logos/react-dark.svg" },
  { name: "Angular", logo: "/logos/angular.svg" },
  { name: "Vite", logo: "/logos/vite.svg" },
];

/** Both boxes hold six rows and the app holds four tiles, so one cycle covers both. */
const HIGHLIGHT_STEPS = 12;

/* Diagram geometry, in viewBox units. */
const BOX_HEIGHT = 297;
const ROW_TOP = 48;
const ROW_STEP = 39;
const HUB = { x: 217.5, y: 102.5, size: 94 } as const;
const APP = { x: 78.5, y: 347.5, width: 372, height: 123 } as const;
const TILE = { size: 52, gap: 26, left: 121, top: 391.5 } as const;
const HUB_CENTER = {
  x: HUB.x + HUB.size / 2,
  y: HUB.y + HUB.size / 2,
} as const;
/** The bracket spans the box rows and stays centered on the hub. */
const BRACKET_LENGTH = (HUB_CENTER.y - 30.5) * 2;
const TILES_RIGHT =
  TILE.left + APP_TILES.length * TILE.size + (APP_TILES.length - 1) * TILE.gap;
/** Small squares between the tiles and larger ones near the box edges. */
const APP_DOTS = [
  { x: (APP.x + TILE.left) / 2, size: 6 },
  ...APP_TILES.slice(1).map((_, index) => ({
    x: TILE.left + (index + 1) * (TILE.size + TILE.gap) - TILE.gap / 2 + 0.5,
    size: 4,
  })),
  { x: (TILES_RIGHT + APP.x + APP.width) / 2 + 0.5, size: 6 },
];

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
        height={BOX_HEIGHT}
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
        const top = ROW_TOP + index * ROW_STEP;
        const lit = active && index === highlight % rows.length;
        return (
          <g
            className={cn(
              "transition-colors duration-300",
              lit ? "text-foreground" : "text-muted-foreground",
            )}
            key={row.label}
          >
            {"logo" in row ? (
              <image
                className={cn(
                  "transition-opacity duration-300",
                  lit ? "opacity-100" : "opacity-60",
                )}
                height={15}
                href={row.logo}
                width={15}
                x={x + 16.5}
                y={top + 9.5}
              />
            ) : (
              <DiagramIcon name={row.icon} x={x + 17} y={top + 10} />
            )}
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
      viewBox="0 0 528 472"
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
        d={`M152 30.5h29.5v${BRACKET_LENGTH}H152M181.5 ${HUB_CENTER.y}H${HUB.x - 0.5}`}
      />
      <Connector
        active={active === 1}
        d={`M376 30.5h-29.5v${BRACKET_LENGTH}H376M346.5 ${HUB_CENTER.y}H${HUB.x + HUB.size - 0.5}`}
      />
      {/* Twin lines down into your app. */}
      <Connector
        active={active === 2}
        d={`M${HUB_CENTER.x - 3} ${HUB.y + HUB.size}V${APP.y}M${HUB_CENTER.x + 3} ${HUB.y + HUB.size}V${APP.y}`}
      />

      <rect
        className="fill-[#0a0a0a] stroke-[color-mix(in_oklab,var(--border)_70%,transparent)]"
        height={HUB.size}
        width={HUB.size}
        x={HUB.x}
        y={HUB.y}
      />
      <image
        height={40}
        href="/img/cortexcn/icon-dark.png"
        width={40}
        x={HUB_CENTER.x - 20}
        y={HUB_CENTER.y - 20}
      />

      <g>
        <rect
          className={cn(
            "fill-background transition-[stroke] duration-500",
            active === 2 ? "stroke-primary" : DIM_STROKE,
          )}
          height={APP.height}
          width={APP.width}
          x={APP.x}
          y={APP.y}
        />
        <text
          className={cn(
            "font-medium font-mono uppercase transition-[fill] duration-500",
            active === 2 ? "fill-foreground" : "fill-muted-foreground",
          )}
          fontSize={12}
          letterSpacing="-0.04em"
          textAnchor="middle"
          x={HUB_CENTER.x}
          y={APP.y + 27.5}
        >
          Your app
        </text>
        {APP_TILES.map((tile, index) => {
          const x = TILE.left + index * (TILE.size + TILE.gap);
          const lit = active === 2 && index === highlight % APP_TILES.length;
          return (
            <g key={tile.name}>
              <rect
                className={cn(
                  "fill-background transition-[stroke] duration-300",
                  lit ? "stroke-primary" : DIM_STROKE,
                )}
                height={TILE.size}
                width={TILE.size}
                x={x + 0.5}
                y={TILE.top}
              />
              <image
                className={cn(
                  "transition-opacity duration-300",
                  lit ? "opacity-100" : "opacity-60",
                )}
                height={24}
                href={tile.logo}
                width={24}
                x={x + 14.5}
                y={TILE.top + 14}
              />
            </g>
          );
        })}
        {APP_DOTS.map((dot) => (
          <rect
            className="fill-muted-foreground"
            height={dot.size}
            key={dot.x}
            width={dot.size}
            x={dot.x - dot.size / 2}
            y={TILE.top + TILE.size / 2 - dot.size / 2}
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
const DESKTOP_QUERY = "(min-width: 1024px)";

export function CapabilitiesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTo = useSmoothScrollTo();
  const [active, setActive] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const { ref, paused } = usePauseWhenOffscreen<HTMLElement>();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // On desktop the diagram stays pinned for three screens, one per capability,
  // like the installation steps.
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (!window.matchMedia(DESKTOP_QUERY).matches) {
      return;
    }
    setActive(
      Math.min(
        CAPABILITIES.length - 1,
        Math.floor(progress * CAPABILITIES.length),
      ),
    );
  });

  // Rows in the active box light up one after another.
  useEffect(() => {
    if (paused) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setHighlight((current) => (current + 1) % HIGHLIGHT_STEPS);
    }, HIGHLIGHT_MS);
    return () => clearInterval(timer);
  }, [paused]);

  // A click scrolls to that capability's screen, so scrolling on from there
  // still steps through the rest.
  const select = (index: number) => {
    const track = trackRef.current;
    if (!(track && window.matchMedia(DESKTOP_QUERY).matches)) {
      setActive(index);
      setHighlight(0);
      return;
    }
    const travel = track.offsetHeight - window.innerHeight;
    const top =
      track.getBoundingClientRect().top +
      window.scrollY +
      ((index + 0.5) / CAPABILITIES.length) * travel;
    scrollTo(top);
  };

  return (
    <section
      aria-label="Core capabilities"
      className="band-dark dark w-full bg-background pb-20 text-foreground"
      ref={ref}
    >
      {/* Pinned at its own height, roughly centered under the header (the
          content is about 38rem tall), so the cards follow straight after it
          once the three screens have passed. */}
      <div className="relative pt-20 lg:h-[300vh]" ref={trackRef}>
        <div className="lg:sticky lg:top-[max(calc(var(--site-header-height)+1.5rem),calc(50svh-19rem))]">
          <Container>
            <div className="grid border-border border-b lg:grid-cols-2">
              <div className="flex flex-col gap-12 pb-12">
                <SectionLabel
                  label="Core capabilities"
                  section="capabilities"
                />
                <div className="flex flex-col gap-6 lg:pr-12" role="tablist">
                  {CAPABILITIES.map((capability, index) => (
                    <CapabilityTab
                      capability={capability}
                      index={index}
                      key={capability.title}
                      onSelect={() => select(index)}
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
                className="relative flex min-h-105 items-center justify-center overflow-hidden border-border border-t bg-card px-6 py-10 sm:px-9 lg:mt-2.25 lg:border-l"
                id="capability-diagram"
                role="tabpanel"
              >
                <DotTexture className="bg-[color-mix(in_oklab,var(--foreground)_12%,transparent)]" />
                <div className="relative w-full max-w-132">
                  <CapabilityDiagram active={active} highlight={highlight} />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <Container>
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
