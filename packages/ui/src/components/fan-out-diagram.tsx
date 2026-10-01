"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useRef } from "react";

import { cn } from "@/lib/utils";

export type FanOutStatus = "running" | "starting" | "stopped" | "error";

export interface FanOutNode {
  label: string;
  /** Secondary text after the label, such as the runtime it runs. */
  meta?: string;
  /** An icon drawn in a 24 by 24 box, such as a Lucide icon element. */
  icon?: ReactNode;
  status?: FanOutStatus;
  /** Text next to the status dot. Defaults to the status name. */
  statusLabel?: string;
}

export interface FanOutDiagramProps {
  /** The card that sends work in, such as "Your app". */
  source: { label: string; icon?: ReactNode };
  /** The icon in the hub. */
  hubIcon?: ReactNode;
  /** The label in the panel's top-left corner. */
  title: string;
  titleIcon?: ReactNode;
  /** The rows the hub fans out to, drawn top to bottom. */
  nodes: FanOutNode[];
  /**
   * Draw the diagram in when it scrolls into view, then send packets along
   * the lines while it stays on screen.
   * @defaultValue true
   */
  animated?: boolean;
  /** Describes the diagram for screen readers. Defaults to one built from the labels. */
  ariaLabel?: string;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Route {
  d: string;
  /** Points along the route, for moving packets along it. */
  points: Point[];
}

interface Layout {
  width: number;
  height: number;
  panel: Box;
  title: Point;
  titleIcon: Point;
  source: Box;
  /** Where the source card slides in from. */
  sourceFrom: { x?: number; y?: number };
  hub: { cx: number; cy: number; r: number };
  sourceRoute: Route;
  /** The arrowhead where the source line meets the hub. */
  sourceArrow: string;
  rows: { box: Box; cy: number; route: Route; arrow: string }[];
  /** x of the status dot, relative to a row's left edge. */
  statusX: number;
}

const ROW_H = 46;
// The hub sits below the panel title even when there are only one or two rows.
const MIN_HUB_GAP = 110;

const STATUS_DOT: Record<FanOutStatus, string> = {
  running: "fill-emerald-500",
  starting: "fill-amber-500",
  stopped: "fill-muted-foreground",
  error: "fill-red-500",
};

/** Drops repeated and collinear points, so every remaining corner is a real turn. */
function simplify(vertices: Point[]): Point[] {
  const out: Point[] = [];
  for (const point of vertices) {
    const last = out.at(-1);
    if (last && last.x === point.x && last.y === point.y) {
      continue;
    }
    const prev = out.at(-2);
    if (
      prev &&
      last &&
      ((prev.x === last.x && last.x === point.x) ||
        (prev.y === last.y && last.y === point.y))
    ) {
      out[out.length - 1] = point;
    } else {
      out.push(point);
    }
  }
  return out;
}

/** A path through right-angle vertices with rounded corners, and points along it. */
function orthogonalRoute(vertices: Point[], radius: number): Route {
  const pts = simplify(vertices);
  const first = pts[0] as Point;
  const d = [`M${first.x},${first.y}`];
  const points: Point[] = [first];
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1] as Point;
    const corner = pts[i] as Point;
    const next = pts[i + 1] as Point;
    const r = Math.min(
      radius,
      Math.hypot(corner.x - prev.x, corner.y - prev.y) / 2,
      Math.hypot(next.x - corner.x, next.y - corner.y) / 2,
    );
    const towards = (from: Point, to: Point) => {
      const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
      return {
        x: from.x + ((to.x - from.x) / length) * r,
        y: from.y + ((to.y - from.y) / length) * r,
      };
    };
    const enter = towards(corner, prev);
    const exit = towards(corner, next);
    d.push(
      `L${enter.x},${enter.y}`,
      `Q${corner.x},${corner.y} ${exit.x},${exit.y}`,
    );
    // The curve's midpoint keeps packets on the corner without measuring the path.
    points.push(
      enter,
      {
        x: 0.25 * enter.x + 0.5 * corner.x + 0.25 * exit.x,
        y: 0.25 * enter.y + 0.5 * corner.y + 0.25 * exit.y,
      },
      exit,
    );
  }
  const last = pts.at(-1) as Point;
  d.push(`L${last.x},${last.y}`);
  points.push(last);
  return { d: d.join(" "), points };
}

const arrowRight = (tipX: number, y: number) =>
  `${tipX - 10},${y - 5} ${tipX},${y} ${tipX - 10},${y + 5}`;
const arrowDown = (x: number, tipY: number) =>
  `${x - 5},${tipY - 10} ${x},${tipY} ${x + 5},${tipY - 10}`;

/** Wide screens: source on the left, hub in the panel, rows on the right. */
function horizontalLayout(count: number): Layout {
  const panelY = 30;
  const pitch = 58;
  const natural = panelY + 50 + ((count - 1) * pitch) / 2 + ROW_H / 2;
  const shift = Math.max(0, panelY + MIN_HUB_GAP - natural);
  const firstRowY = panelY + 50 + shift;
  const hubCy = natural + shift;
  const panelH = 50 + shift + count * pitch - (pitch - ROW_H) + 48;
  const hub = { cx: 372, cy: hubCy, r: 50 };
  return {
    width: 1040,
    height: panelY * 2 + panelH,
    panel: { x: 272, y: panelY, w: 752, h: panelH },
    title: { x: 298, y: panelY + 41 },
    titleIcon: { x: 298, y: panelY + 20 },
    source: { x: 16, y: hubCy - 36, w: 200, h: 72 },
    sourceFrom: { x: -16 },
    hub,
    sourceRoute: orthogonalRoute(
      [
        { x: 216, y: hubCy },
        { x: hub.cx - hub.r - 8, y: hubCy },
      ],
      0,
    ),
    sourceArrow: arrowRight(hub.cx - hub.r - 6.5, hubCy),
    rows: Array.from({ length: count }, (_, index) => {
      const y = firstRowY + index * pitch;
      const cy = y + ROW_H / 2;
      return {
        box: { x: 612, y, w: 384, h: ROW_H },
        cy,
        route: orthogonalRoute(
          [
            { x: hub.cx + hub.r, y: hubCy },
            { x: 530, y: hubCy },
            { x: 530, y: cy },
            { x: 604, y: cy },
          ],
          15,
        ),
        arrow: arrowRight(605.5, cy),
      };
    }),
    statusX: 318,
  };
}

/** Narrow screens: source on top, hub in the panel, rows stacked below it. */
function verticalLayout(count: number): Layout {
  const panelY = 104;
  const pitch = 56;
  const hub = { cx: 200, cy: panelY + 92, r: 38 };
  const firstRowY = hub.cy + hub.r + 36;
  const lastRowBottom = firstRowY + (count - 1) * pitch + ROW_H;
  const panelH = lastRowBottom + 22 - panelY;
  const trunkX = 34;
  const branchY = hub.cy + hub.r + 16;
  return {
    width: 400,
    height: panelY + panelH + 14,
    panel: { x: 10, y: panelY, w: 380, h: panelH },
    title: { x: 28, y: panelY + 36 },
    titleIcon: { x: 28, y: panelY + 17 },
    source: { x: 20, y: 14, w: 360, h: 60 },
    sourceFrom: { y: -12 },
    hub,
    sourceRoute: orthogonalRoute(
      [
        { x: hub.cx, y: 74 },
        { x: hub.cx, y: hub.cy - hub.r - 8 },
      ],
      0,
    ),
    sourceArrow: arrowDown(hub.cx, hub.cy - hub.r - 6.5),
    rows: Array.from({ length: count }, (_, index) => {
      const y = firstRowY + index * pitch;
      const cy = y + ROW_H / 2;
      return {
        box: { x: 62, y, w: 318, h: ROW_H },
        cy,
        route: orthogonalRoute(
          [
            { x: hub.cx, y: hub.cy + hub.r },
            { x: hub.cx, y: branchY },
            { x: trunkX, y: branchY },
            { x: trunkX, y: cy },
            { x: 55, y: cy },
          ],
          10,
        ),
        arrow: arrowRight(61.5, cy),
      };
    }),
    statusX: 250,
  };
}

/** Keyframe times for each point, spaced by distance so packets move at an even speed. */
function keyTimes(points: Point[]): number[] {
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1] as Point;
    const point = points[i] as Point;
    lengths.push(
      (lengths[i - 1] ?? 0) + Math.hypot(point.x - prev.x, point.y - prev.y),
    );
  }
  const total = lengths.at(-1) || 1;
  return lengths.map((length) => length / total);
}

/** Draws a 24 by 24 icon at a size, with its top-left corner at x, y. */
function Icon({
  children,
  x,
  y,
  size,
}: {
  children: ReactNode;
  x: number;
  y: number;
  size: number;
}) {
  return (
    <g
      className="text-foreground"
      transform={`translate(${x},${y}) scale(${size / 24})`}
    >
      {children}
    </g>
  );
}

function Packet({
  route,
  delay,
  duration,
}: {
  route: Route;
  delay: number;
  duration: number;
}) {
  const loop = {
    delay,
    ease: "linear" as const,
    repeat: Number.POSITIVE_INFINITY,
    repeatDelay: 1.2,
  };
  const times = keyTimes(route.points);
  return (
    <motion.circle
      animate={{
        cx: route.points.map((point) => point.x),
        cy: route.points.map((point) => point.y),
        opacity: [0, 1, 1, 0],
      }}
      className="fill-foreground"
      initial={{
        cx: route.points[0]?.x ?? 0,
        cy: route.points[0]?.y ?? 0,
        opacity: 0,
      }}
      r={3.5}
      transition={{
        cx: { ...loop, duration, times },
        cy: { ...loop, duration, times },
        opacity: { ...loop, duration, times: [0, 0.1, 0.85, 1] },
      }}
    />
  );
}

interface DiagramProps extends Omit<
  FanOutDiagramProps,
  "className" | "ariaLabel"
> {
  layout: Layout;
  label: string;
  className: string;
}

function Diagram({
  layout,
  label,
  className,
  source,
  hubIcon,
  title,
  titleIcon,
  nodes,
  animated,
}: DiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  // The server never knows the reader's motion setting, so the first render
  // must not depend on it: it only changes timings and the looping effects.
  const reduceMotion = useReducedMotion() ?? false;
  const revealed = useInView(svgRef, { once: true, amount: 0.3 });
  const onScreen = useInView(svgRef, { amount: 0.1 });
  const shown = !animated || reduceMotion || revealed;
  const live = Boolean(animated) && !reduceMotion;

  const reveal = (
    delay: number,
    from: { x?: number; y?: number; scale?: number } = {},
  ) =>
    animated
      ? {
          initial: { opacity: 0, ...from },
          animate: shown ? { opacity: 1, x: 0, y: 0, scale: 1 } : undefined,
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {};
  const draw = (delay: number) =>
    animated
      ? {
          initial: { pathLength: 0, opacity: 0 },
          animate: shown ? { pathLength: 1, opacity: 1 } : undefined,
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: 0.55, delay, ease: "easeInOut" as const },
        }
      : {};
  const lineDelay = (index: number) => 0.55 + index * 0.06;
  const rowDelay = (index: number) => 0.75 + index * 0.07;
  const packetsStart = rowDelay(layout.rows.length);
  const { panel, hub } = layout;

  return (
    <svg
      aria-label={label}
      className={cn("h-auto w-full select-none", className)}
      fill="none"
      ref={svgRef}
      role="img"
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{label}</title>
      <defs>
        <filter height="220%" id={`${id}-card`} width="140%" x="-20%" y="-40%">
          <feDropShadow
            dx="0"
            dy="6"
            floodColor="#0a0a0a"
            floodOpacity="0.07"
            stdDeviation="8"
          />
        </filter>
        <filter height="128%" id={`${id}-panel`} width="120%" x="-10%" y="-12%">
          <feDropShadow
            dx="0"
            dy="10"
            floodColor="#0a0a0a"
            floodOpacity="0.05"
            stdDeviation="16"
          />
        </filter>
        <filter height="220%" id={`${id}-hub`} width="220%" x="-60%" y="-60%">
          <feDropShadow
            dx="0"
            dy="10"
            floodColor="#0a0a0a"
            floodOpacity="0.12"
            stdDeviation="12"
          />
        </filter>
        <pattern
          height="22"
          id={`${id}-dots`}
          patternUnits="userSpaceOnUse"
          width="22"
        >
          <circle className="fill-border" cx="1.1" cy="1.1" r="1.1" />
        </pattern>
        <clipPath id={`${id}-panel-clip`}>
          <rect
            height={panel.h}
            rx="24"
            width={panel.w}
            x={panel.x}
            y={panel.y}
          />
        </clipPath>
      </defs>

      {/* Panel */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        {...reveal(0, { scale: 0.98 })}
      >
        <rect
          className="fill-muted/60 stroke-border"
          filter={`url(#${id}-panel)`}
          height={panel.h}
          rx="24"
          width={panel.w}
          x={panel.x}
          y={panel.y}
        />
        <rect
          clipPath={`url(#${id}-panel-clip)`}
          fill={`url(#${id}-dots)`}
          height={panel.h}
          opacity="0.7"
          width={panel.w}
          x={panel.x}
          y={panel.y}
        />
        {titleIcon ? (
          <Icon size={26} x={layout.titleIcon.x} y={layout.titleIcon.y}>
            {titleIcon}
          </Icon>
        ) : null}
        <text
          className="fill-foreground"
          fontSize="22"
          fontWeight="650"
          letterSpacing="-0.3"
          x={layout.title.x + (titleIcon ? 36 : 0)}
          y={layout.title.y}
        >
          {title}
        </text>
      </motion.g>

      {/* Lines and arrowheads */}
      <g
        className="stroke-muted-foreground/45"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      >
        <motion.path d={layout.sourceRoute.d} {...draw(0.4)} />
        {layout.rows.map((row, index) => (
          <motion.path
            d={row.route.d}
            key={`line-${nodes[index]?.label}-${index}`}
            {...draw(lineDelay(index))}
          />
        ))}
      </g>
      <g className="fill-muted-foreground/70">
        <motion.polygon points={layout.sourceArrow} {...reveal(0.85)} />
        {layout.rows.map((row, index) => (
          <motion.polygon
            key={`arrow-${nodes[index]?.label}-${index}`}
            points={row.arrow}
            {...reveal(lineDelay(index) + 0.45)}
          />
        ))}
      </g>

      {/* Packets travel only while the diagram is on screen. */}
      {live && revealed && onScreen ? (
        <g>
          <Packet
            delay={packetsStart}
            duration={0.9}
            route={layout.sourceRoute}
          />
          {layout.rows.map((row, index) => (
            <Packet
              delay={packetsStart + 0.7 + index * 0.35}
              duration={1.5}
              key={`packet-${nodes[index]?.label}-${index}`}
              route={row.route}
            />
          ))}
        </g>
      ) : null}

      {/* Source */}
      <motion.g {...reveal(0.15, layout.sourceFrom)}>
        <rect
          className="fill-card stroke-border"
          filter={`url(#${id}-card)`}
          height={layout.source.h}
          rx="16"
          width={layout.source.w}
          x={layout.source.x}
          y={layout.source.y}
        />
        {source.icon ? (
          <Icon
            size={24}
            x={layout.source.x + 20}
            y={layout.source.y + layout.source.h / 2 - 12}
          >
            {source.icon}
          </Icon>
        ) : null}
        <text
          className="fill-foreground"
          fontSize="19"
          fontWeight="650"
          x={layout.source.x + (source.icon ? 56 : 24)}
          y={layout.source.y + layout.source.h / 2 + 6.5}
        >
          {source.label}
        </text>
      </motion.g>

      {/* Hub */}
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        {...reveal(0.3, { scale: 0.6 })}
      >
        <circle
          className="fill-card stroke-border"
          cx={hub.cx}
          cy={hub.cy}
          filter={`url(#${id}-hub)`}
          r={hub.r}
        />
        {hubIcon ? (
          <Icon
            size={hub.r * 0.88}
            x={hub.cx - hub.r * 0.44}
            y={hub.cy - hub.r * 0.44}
          >
            {hubIcon}
          </Icon>
        ) : null}
      </motion.g>

      {/* Rows */}
      {layout.rows.map((row, index) => {
        const node = nodes[index];
        if (!node) {
          return null;
        }
        const { box, cy } = row;
        const status = node.status;
        const dotX = box.x + layout.statusX;
        return (
          <motion.g
            key={`row-${node.label}-${index}`}
            {...reveal(rowDelay(index), { x: 14 })}
          >
            <rect
              className="fill-card stroke-border"
              filter={`url(#${id}-card)`}
              height={box.h}
              rx="12"
              width={box.w}
              x={box.x}
              y={box.y}
            />
            <rect
              className="fill-card stroke-border"
              height="24"
              rx="6"
              width="24"
              x={box.x + 10}
              y={box.y + 11}
            />
            {node.icon ? (
              <Icon size={18} x={box.x + 13} y={box.y + 14}>
                {node.icon}
              </Icon>
            ) : null}
            <text
              className="fill-foreground"
              fontSize="16"
              fontWeight="650"
              x={box.x + 46}
              y={box.y + 29}
            >
              {node.label}
              {node.meta ? (
                <tspan
                  className="fill-muted-foreground"
                  dx="12"
                  fontSize="13.5"
                  fontWeight="400"
                >
                  {node.meta}
                </tspan>
              ) : null}
            </text>
            {status ? (
              <>
                {status === "running" && live && onScreen ? (
                  <motion.circle
                    animate={{ r: [4, 10], opacity: [0.35, 0] }}
                    className={STATUS_DOT[status]}
                    cx={dotX}
                    cy={cy}
                    initial={{ r: 4, opacity: 0.35 }}
                    r={4}
                    transition={{
                      duration: 1.8,
                      delay: index * 0.25,
                      ease: "easeOut",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ) : null}
                {status === "running" && !(live && onScreen) ? (
                  <circle
                    className={STATUS_DOT[status]}
                    cx={dotX}
                    cy={cy}
                    opacity={0.16}
                    r="6.5"
                  />
                ) : null}
                <circle
                  className={STATUS_DOT[status]}
                  cx={dotX}
                  cy={cy}
                  r="4"
                />
                <text
                  className="fill-muted-foreground"
                  fontSize="12.5"
                  x={dotX + 12}
                  y={cy + 4.5}
                >
                  {node.statusLabel ?? status}
                </text>
              </>
            ) : null}
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * One source feeds a hub, which fans out to a column of nodes, each with a
 * live status. Built for architecture sections: an app calling a platform
 * that runs one sandbox, worker, or agent per customer. It lays out left to
 * right when its container is at least 36rem wide, and top to bottom below.
 */
export function FanOutDiagram({
  className,
  ariaLabel,
  animated = true,
  ...props
}: FanOutDiagramProps) {
  const count = Math.max(props.nodes.length, 1);
  const label =
    ariaLabel ??
    `${props.source.label} sends work to ${props.title}, which runs ${props.nodes.length} ${props.nodes.length === 1 ? "node" : "nodes"}: ${props.nodes
      .map((node) =>
        [node.label, node.meta, node.statusLabel ?? node.status]
          .filter(Boolean)
          .join(", "),
      )
      .join("; ")}.`;

  return (
    <div className={cn("@container w-full", className)}>
      <Diagram
        {...props}
        animated={animated}
        className="@xl:block hidden"
        label={label}
        layout={horizontalLayout(count)}
      />
      <Diagram
        {...props}
        animated={animated}
        className="@xl:hidden"
        label={label}
        layout={verticalLayout(count)}
      />
    </div>
  );
}
