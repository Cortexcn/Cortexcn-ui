"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface SphereMenuItem {
  image: string;
  title: string;
  description?: string;
  href: string;
}

export interface SphereMenuProps {
  items: SphereMenuItem[];
  /** Tiles on the sphere. Items repeat to fill them. */
  tiles?: number;
  /** Sphere size, as a share of the shorter side of the box. */
  scale?: number;
  /** Label for the link on the item in front. */
  actionLabel?: string;
  className?: string;
}

type Quat = [number, number, number, number];
type Vec3 = [number, number, number];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** Share of spin kept each frame after the pointer lets go. */
const FRICTION = 0.94;
/** Share of the remaining turn taken each frame while snapping. */
const SNAP = 0.14;
/** How far the sphere draws back while it is held. */
const HELD_SCALE = 0.88;
/** Radians of turn per pixel dragged. */
const DRAG_SPEED = 0.0055;
/** Room kept under the sphere for the caption, in pixels. */
const CAPTION_SPACE = 136;

function quatFromAxisAngle(axis: Vec3, angle: number): Quat {
  const length = Math.hypot(axis[0], axis[1], axis[2]);
  if (length < 1e-9 || Math.abs(angle) < 1e-9) {
    return [1, 0, 0, 0];
  }
  const s = Math.sin(angle / 2) / length;
  return [Math.cos(angle / 2), axis[0] * s, axis[1] * s, axis[2] * s];
}

function quatMultiply(a: Quat, b: Quat): Quat {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0],
  ];
}

function quatNormalize(q: Quat): Quat {
  const length = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / length, q[1] / length, q[2] / length, q[3] / length];
}

/** The rotation as a 3 by 3 matrix, rows first. */
type Mat3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

function quatToMatrix([w, x, y, z]: Quat): Mat3 {
  return [
    1 - 2 * (y * y + z * z),
    2 * (x * y - w * z),
    2 * (x * z + w * y),
    2 * (x * y + w * z),
    1 - 2 * (x * x + z * z),
    2 * (y * z - w * x),
    2 * (x * z - w * y),
    2 * (y * z + w * x),
    1 - 2 * (x * x + y * y),
  ];
}

function rotate(m: Mat3, [x, y, z]: Vec3): Vec3 {
  return [
    m[0] * x + m[1] * y + m[2] * z,
    m[3] * x + m[4] * y + m[5] * z,
    m[6] * x + m[7] * y + m[8] * z,
  ];
}

/** Evenly spread directions on a sphere (a Fibonacci lattice), y pointing down. */
function sphereDirections(count: number): Vec3[] {
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const ring = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    return [Math.cos(theta) * ring, y, Math.sin(theta) * ring];
  });
}

/** How a tile at this direction is turned to sit flat on the sphere. */
function tileAngles([x, y, z]: Vec3): { yaw: number; pitch: number } {
  return { yaw: Math.atan2(x, z), pitch: -Math.asin(y) };
}

/** The tile's "up" on the sphere, for the same yaw and pitch as its transform. */
function tileUp(direction: Vec3): Vec3 {
  const { yaw, pitch } = tileAngles(direction);
  return [
    -Math.sin(pitch) * Math.sin(yaw),
    -Math.cos(pitch),
    -Math.sin(pitch) * Math.cos(yaw),
  ];
}

/** The turn that brings a direction to face the viewer (+z). */
function turnToFront(direction: Vec3): { axis: Vec3; angle: number } {
  const [x, y, z] = direction;
  // direction x (0, 0, 1)
  const axis: Vec3 = [y, -x, 0];
  const angle = Math.acos(Math.max(-1, Math.min(1, z)));
  return { axis, angle };
}

/** The roll about the view axis that stands a tile's "up" straight up. */
function uprightRoll([x, y]: Vec3): number {
  if (Math.hypot(x, y) < 1e-6) {
    return 0;
  }
  const roll = -Math.PI / 2 - Math.atan2(y, x);
  return Math.atan2(Math.sin(roll), Math.cos(roll));
}

const VIEW_AXIS: Vec3 = [0, 0, 1];

/** Part of the way from q toward the turn that shows this tile upright in front. */
function stepToFront(
  q: Quat,
  direction: Vec3,
  up: Vec3,
  share: number,
): { q: Quat; remaining: number } {
  const { axis, angle } = turnToFront(rotate(quatToMatrix(q), direction));
  const turned = quatMultiply(quatFromAxisAngle(axis, angle * share), q);
  const roll = uprightRoll(rotate(quatToMatrix(turned), up));
  const rolled = quatMultiply(
    quatFromAxisAngle(VIEW_AXIS, roll * share),
    turned,
  );
  return { q: quatNormalize(rolled), remaining: angle + Math.abs(roll) };
}

interface Motion {
  q: Quat;
  spin: { axis: Vec3; angle: number };
  pull: number;
  dragging: boolean;
  reduceMotion: boolean;
}

/**
 * One frame of motion: the spin coasts down, then the front tile (at this
 * direction, with this up) snaps upright, and the sphere eases back to full
 * size. Returns false once nothing is left to move.
 */
function advance(motion: Motion, direction: Vec3, up: Vec3): boolean {
  const pullTarget = motion.dragging ? HELD_SCALE : 1;
  motion.pull += (pullTarget - motion.pull) * (motion.reduceMotion ? 1 : 0.18);
  const pulling = Math.abs(pullTarget - motion.pull) > 0.001;
  if (motion.dragging) {
    return true;
  }
  if (motion.spin.angle > 0.0008) {
    motion.q = quatNormalize(
      quatMultiply(
        quatFromAxisAngle(motion.spin.axis, motion.spin.angle),
        motion.q,
      ),
    );
    motion.spin.angle *= FRICTION;
    return true;
  }
  motion.spin.angle = 0;
  const next = stepToFront(
    motion.q,
    direction,
    up,
    motion.reduceMotion ? 1 : SNAP,
  );
  if (next.remaining > 0.002 || pulling) {
    motion.q = next.q;
    return true;
  }
  motion.pull = 1;
  return false;
}

/**
 * A sphere of image tiles you can spin in any direction. When it slows down,
 * the nearest tile turns to face you and its title, text, and link appear.
 */
export function SphereMenu({
  items,
  tiles = 36,
  scale = 1,
  actionLabel = "Open",
  className,
}: SphereMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const directions = useMemo(() => sphereDirections(tiles), [tiles]);
  const ups = useMemo(() => directions.map(tileUp), [directions]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [settled, setSettled] = useState(true);

  const state = useRef({
    q: [1, 0, 0, 0] as Quat,
    spin: { axis: [0, 1, 0] as Vec3, angle: 0 },
    dragging: false,
    last: { x: 0, y: 0 },
    raf: 0,
    front: 0,
    pull: 1,
    settled: true,
    reduceMotion: false,
  });

  const measured = size.width > 0;
  const radius = Math.max(
    80,
    Math.min(size.width, size.height - CAPTION_SPACE) * 0.5 * scale,
  );
  // Tiles shrink as there are more of them, so they never overlap.
  const tileSize =
    radius * Math.sqrt((4 * Math.PI) / Math.max(1, tiles)) * 0.86;

  /** Writes the sphere's turn and each tile's fade to the page. */
  const draw = useCallback(() => {
    const s = state.current;
    const m = quatToMatrix(s.q);
    const globe = globeRef.current;
    if (globe) {
      // CSS reads matrix3d column by column.
      globe.style.transform = `translateZ(${-radius}px) scale(${s.pull}) matrix3d(${m[0]},${m[3]},${m[6]},0,${m[1]},${m[4]},${m[7]},0,${m[2]},${m[5]},${m[8]},0,0,0,0,1)`;
    }
    let best = -2;
    directions.forEach((direction, i) => {
      const facing = rotate(m, direction)[2];
      if (facing > best) {
        best = facing;
        s.front = i;
      }
      const tile = tileRefs.current[i];
      if (tile) {
        const fade = Math.max(0, Math.min(1, (facing + 0.15) / 0.75));
        tile.style.opacity = fade.toFixed(3);
      }
    });
  }, [directions, radius]);

  const setSettledState = useCallback(
    (value: boolean) => {
      const s = state.current;
      if (s.settled !== value) {
        s.settled = value;
        setSettled(value);
      }
      if (value) {
        setActiveIndex(s.front % Math.max(1, items.length));
      }
    },
    [items.length],
  );

  const frame = useCallback(() => {
    const s = state.current;
    const moving = advance(
      s,
      directions[s.front] ?? VIEW_AXIS,
      ups[s.front] ?? [0, -1, 0],
    );
    draw();
    if (!moving) {
      setSettledState(true);
      s.raf = 0;
      return;
    }
    s.raf = requestAnimationFrame(frame);
  }, [directions, ups, draw, setSettledState]);

  const wake = useCallback(() => {
    const s = state.current;
    if (!s.raf) {
      s.raf = requestAnimationFrame(frame);
    }
  }, [frame]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    state.current.reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const observer = new ResizeObserver(() =>
      setSize({ width: container.clientWidth, height: container.clientHeight }),
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(state.current.raf);
      state.current.raf = 0;
    };
  }, []);

  // Start with the first tile upright in front. A resize keeps the turn.
  useLayoutEffect(() => {
    const s = state.current;
    s.q = stepToFront(
      [1, 0, 0, 0],
      directions[0] ?? VIEW_AXIS,
      ups[0] ?? [0, -1, 0],
      1,
    ).q;
    s.front = 0;
  }, [directions, ups]);

  // Before paint, so tiles never show a frame without their fade.
  // biome-ignore lint/correctness/useExhaustiveDependencies: draw again once the tiles mount
  useLayoutEffect(() => {
    draw();
  }, [draw, measured]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    s.dragging = true;
    s.last = { x: event.clientX, y: event.clientY };
    s.spin.angle = 0;
    setSettledState(false);
    wake();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    if (!s.dragging) {
      return;
    }
    const dx = event.clientX - s.last.x;
    const dy = event.clientY - s.last.y;
    s.last = { x: event.clientX, y: event.clientY };
    const distance = Math.hypot(dx, dy);
    if (distance < 0.01) {
      return;
    }
    // Dragging right turns the front surface right; dragging down turns it down.
    const axis: Vec3 = [-dy, dx, 0];
    const angle = distance * DRAG_SPEED;
    s.q = quatNormalize(quatMultiply(quatFromAxisAngle(axis, angle), s.q));
    s.spin = { axis, angle: s.reduceMotion ? 0 : angle };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const s = state.current;
    s.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    wake();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const turns: Record<string, Vec3> = {
      ArrowLeft: [0, -1, 0],
      ArrowRight: [0, 1, 0],
      ArrowUp: [1, 0, 0],
      ArrowDown: [-1, 0, 0],
    };
    const axis = turns[event.key];
    if (!axis) {
      return;
    }
    event.preventDefault();
    const s = state.current;
    s.q = quatNormalize(quatMultiply(quatFromAxisAngle(axis, 0.75), s.q));
    // Let the snap pick the tile nearest the new front.
    draw();
    setSettledState(false);
    wake();
  };

  const item = items[activeIndex];
  const perspective = radius * 2.1;

  return (
    <div
      className={cn(
        "relative h-[560px] w-full touch-none select-none overflow-hidden",
        className,
      )}
      data-slot="sphere-menu"
      ref={containerRef}
    >
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: a drag and arrow-key surface; every item is also a plain link below */}
      <div
        aria-label="Drag or use the arrow keys to turn the sphere"
        className="absolute inset-0 cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset active:cursor-grabbing"
        onKeyDown={onKeyDown}
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        role="application"
        style={{ perspective: `${perspective}px` }}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the arrow keys turn the sphere
        tabIndex={0}
      >
        <div
          className="absolute left-1/2"
          ref={globeRef}
          style={{
            top: (size.height - CAPTION_SPACE) / 2 + 8,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Tiles wait for the box size, so the server and browser agree. */}
          {(measured ? directions : []).map((direction, i) => {
            const tileItem = items[i % Math.max(1, items.length)];
            const { yaw, pitch } = tileAngles(direction);
            return (
              <div
                className="absolute overflow-hidden rounded-app-icon bg-muted shadow-sm [backface-visibility:hidden]"
                // biome-ignore lint/suspicious/noArrayIndexKey: tiles are fixed positions on the sphere
                key={i}
                ref={(element) => {
                  tileRefs.current[i] = element;
                }}
                style={{
                  width: tileSize,
                  height: tileSize,
                  marginLeft: -tileSize / 2,
                  marginTop: -tileSize / 2,
                  transform: `rotateY(${yaw}rad) rotateX(${pitch}rad) translateZ(${radius}px)`,
                }}
              >
                {tileItem ? (
                  // biome-ignore lint/performance/noImgElement: framework-agnostic registry component
                  <img
                    alt=""
                    className="pointer-events-none size-full object-cover"
                    draggable={false}
                    height={tileSize}
                    src={tileItem.image}
                    width={tileSize}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* The item in front. It fades out while the sphere turns. */}
      {item ? (
        <div
          aria-live="polite"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-3 px-6 text-center transition-[opacity,translate] duration-slow",
            settled ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-foreground text-lg tracking-tight">
              {item.title}
            </p>
            {item.description ? (
              <p className="max-w-xs text-muted-foreground text-sm">
                {item.description}
              </p>
            ) : null}
          </div>
          <a
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground px-4 font-medium text-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
              settled ? "pointer-events-auto" : "pointer-events-none",
            )}
            href={item.href}
            tabIndex={settled ? 0 : -1}
          >
            {actionLabel} {item.title}
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>
      ) : null}

      {/* Every item as a plain link, for screen readers and keyboards. */}
      <ul className="sr-only">
        {items.map((entry) => (
          <li key={entry.href + entry.title}>
            <a href={entry.href}>{entry.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
