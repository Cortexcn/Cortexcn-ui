"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface LanyardBadgeProps {
  /** The front of the card. Any content, laid out inside the card. */
  front: ReactNode;
  /** The back of the card, shown when it is clicked or tapped. */
  back?: ReactNode;
  /** Words repeated along the strap. */
  strapText?: string;
  /** Strap length from the top edge to the clip, in pixels. */
  strapLength?: number;
  cardWidth?: number;
  cardHeight?: number;
  /** Downward pull, in pixels per frame squared at 60 frames a second. */
  gravity?: number;
  /** The badge falls in from the side on first render. */
  dropIn?: boolean;
  className?: string;
}

interface Point {
  x: number;
  y: number;
  px: number;
  py: number;
}

/** Rope points between the anchor and the clip. More points, smoother strap. */
const SEGMENTS = 12;
/** Constraint passes per step: more passes, a stiffer strap. */
const ITERATIONS = 14;
/** Share of velocity kept each step, so a swing settles. */
const DAMPING = 0.985;
/** Height of the metal clip between the strap and the card. */
const CLIP = 22;
const STEP_MS = 1000 / 60;
/** Movement under this many pixels counts as a click, which flips the card. */
const CLICK_SLOP = 5;
/** The strap hangs from just above the top edge. */
const ANCHOR_Y = -8;

function makePoint(x: number, y: number): Point {
  return { x, y, px: x, py: y };
}

/** A smooth path through the points, as cubic curves (Catmull-Rom). */
function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) {
    return "";
  }
  const first = points[0];
  let d = first ? `M${first.x.toFixed(2)} ${first.y.toFixed(2)}` : "";
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (!(p1 && p2)) {
      continue;
    }
    const p0 = points[i - 1] ?? p1;
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** Pulls two points back to a fixed distance apart. Pinned points do not move. */
function constrain(
  a: Point,
  b: Point,
  length: number,
  aPinned: boolean,
  bPinned: boolean,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy) || 0.0001;
  const offset = (distance - length) / distance;
  if (aPinned && bPinned) {
    return;
  }
  if (aPinned) {
    b.x -= dx * offset;
    b.y -= dy * offset;
  } else if (bPinned) {
    a.x += dx * offset;
    a.y += dy * offset;
  } else {
    a.x += dx * offset * 0.5;
    a.y += dy * offset * 0.5;
    b.x -= dx * offset * 0.5;
    b.y -= dy * offset * 0.5;
  }
}

/** Verlet move: each free point keeps its velocity, damped, and falls. */
function integrate(points: Point[], gravity: number) {
  for (const point of points) {
    const vx = (point.x - point.px) * DAMPING;
    const vy = (point.y - point.py) * DAMPING;
    point.px = point.x;
    point.py = point.y;
    point.x += vx;
    point.y += vy + gravity;
  }
}

/** Moves a point toward a target, stopping where the strap runs out. */
function withinReach(
  target: { x: number; y: number },
  anchorX: number,
  reach: number,
) {
  const dx = target.x - anchorX;
  const dy = target.y - ANCHOR_Y;
  const far = Math.hypot(dx, dy);
  if (far <= reach) {
    return target;
  }
  return { x: anchorX + (dx / far) * reach, y: ANCHOR_Y + (dy / far) * reach };
}

/** Holds every strap segment and the card at their lengths. */
function solve(
  rope: Point[],
  end: Point,
  tail: Point,
  segment: number,
  cardLength: number,
  dragging: boolean,
) {
  for (let n = 0; n < ITERATIONS; n++) {
    for (let i = 0; i < SEGMENTS; i++) {
      const a = rope[i];
      const b = rope[i + 1];
      if (a && b) {
        constrain(a, b, segment, i === 0, dragging && i + 1 === SEGMENTS);
      }
    }
    constrain(end, tail, cardLength, dragging, dragging);
  }
}

/** Shrinks the card to fit a box narrower than it, never below half size. */
function fitScale(boxWidth: number, cardWidth: number) {
  return Math.max(0.5, Math.min(1, (boxWidth - 24) / cardWidth));
}

/**
 * An ID badge hanging from a strap. Drag the card and it swings back on a
 * simulated rope; click or tap it to flip it over.
 */
export function LanyardBadge({
  front,
  back,
  strapText = "CORTEXCN",
  strapLength = 200,
  cardWidth = 232,
  cardHeight = 320,
  gravity = 0.55,
  dropIn = true,
  className,
}: LanyardBadgeProps) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGGElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const flippedRef = useRef(false);

  const sim = useRef({
    rope: [] as Point[],
    /** The card's far end, held at the card's length from the clip. */
    tail: makePoint(0, 0),
    anchorX: 0,
    width: 0,
    tilt: 0,
    dragging: false,
    grab: 0.5,
    pointer: { x: 0, y: 0 },
    downAt: { x: 0, y: 0 },
    moved: false,
    raf: 0,
    last: 0,
    carry: 0,
    still: 0,
    fit: 1,
    reduceMotion: false,
  });

  const segment = strapLength / SEGMENTS;

  /** Lays the rope out from the anchor, straight down or off to one side. */
  const layout = useCallback(
    (width: number, swingIn: boolean) => {
      const s = sim.current;
      s.width = width;
      s.anchorX = width / 2;
      s.fit = fitScale(width, cardWidth);
      const cardLength = CLIP + cardHeight * s.fit;
      const angle = swingIn ? Math.PI / 2.6 : 0;
      const along = (distance: number) =>
        makePoint(
          s.anchorX + Math.sin(angle) * distance,
          ANCHOR_Y + Math.cos(angle) * distance,
        );
      s.rope = Array.from({ length: SEGMENTS + 1 }, (_, i) =>
        along(segment * i),
      );
      s.tail = along(strapLength + cardLength);
    },
    [segment, cardHeight, cardWidth, strapLength],
  );

  /** Writes the current state to the strap, clip, and card. */
  const draw = useCallback(() => {
    const s = sim.current;
    const end = s.rope[SEGMENTS];
    if (!end) {
      return;
    }
    const angle = Math.atan2(s.tail.x - end.x, s.tail.y - end.y);
    strapRef.current?.setAttribute("d", smoothPath(s.rope));
    clipRef.current?.setAttribute(
      "transform",
      `translate(${end.x.toFixed(2)} ${end.y.toFixed(2)}) rotate(${((-angle * 180) / Math.PI).toFixed(2)})`,
    );
    const card = cardRef.current;
    if (card) {
      const flip = flippedRef.current ? 180 : 0;
      card.style.transform = `translate(${(end.x - cardWidth / 2).toFixed(2)}px, ${end.y.toFixed(2)}px) rotate(${((-angle * 180) / Math.PI).toFixed(2)}deg) translateY(${CLIP}px) scale(${s.fit.toFixed(3)}) perspective(900px) rotateY(${(s.tilt + flip).toFixed(2)}deg)`;
    }
    const shine = shineRef.current;
    if (shine) {
      shine.style.backgroundPosition = `${(50 + s.tilt * 1.6 + (-angle * 180) / Math.PI).toFixed(1)}% 0`;
    }
  }, [cardWidth]);

  /** One fixed physics step: move, then hold every length in place. */
  const step = useCallback(() => {
    const s = sim.current;
    const { rope, tail } = s;
    const cardLength = CLIP + cardHeight * s.fit;
    const anchor = rope[0];
    const end = rope[SEGMENTS];
    if (!(anchor && end)) {
      return;
    }

    integrate([...rope.slice(1), tail], gravity);

    if (s.dragging) {
      // Move the card so the grabbed spot sits under the pointer.
      const target = withinReach(
        s.pointer,
        s.anchorX,
        strapLength + cardLength * s.grab,
      );
      const dx = target.x - (end.x + (tail.x - end.x) * s.grab);
      const dy = target.y - (end.y + (tail.y - end.y) * s.grab);
      end.x += dx;
      end.y += dy;
      tail.x += dx;
      tail.y += dy;
    }

    anchor.x = s.anchorX;
    anchor.y = ANCHOR_Y;
    solve(rope, end, tail, segment, cardLength, s.dragging);

    // The card turns toward the viewer as it swings sideways.
    const sideways = (tail.x - tail.px + (end.x - end.px)) / 2;
    s.tilt += (Math.max(-55, Math.min(55, sideways * 6)) - s.tilt) * 0.12;

    const motion =
      Math.abs(tail.x - tail.px) +
      Math.abs(tail.y - tail.py) +
      Math.abs(sideways);
    s.still = !s.dragging && motion < 0.02 ? s.still + 1 : 0;
  }, [gravity, segment, cardHeight, strapLength]);

  const loop = useCallback(
    (time: number) => {
      const s = sim.current;
      if (!s.last) {
        s.last = time;
      }
      s.carry += Math.min(64, time - s.last);
      s.last = time;
      while (s.carry >= STEP_MS) {
        step();
        s.carry -= STEP_MS;
      }
      draw();
      // Stop once the badge has hung still for half a second.
      if (s.still > 30) {
        s.raf = 0;
        s.last = 0;
        return;
      }
      s.raf = requestAnimationFrame(loop);
    },
    [step, draw],
  );

  const wake = useCallback(() => {
    const s = sim.current;
    if (!(s.raf || s.reduceMotion)) {
      s.still = 0;
      s.raf = requestAnimationFrame(loop);
    }
  }, [loop]);

  /** Runs the rope to rest at once, for reduced motion. */
  const settle = useCallback(() => {
    for (let i = 0; i < 600; i++) {
      step();
    }
    sim.current.tilt = 0;
    draw();
  }, [step, draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const s = sim.current;
    s.reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    layout(container.clientWidth, dropIn && !s.reduceMotion);
    if (s.reduceMotion) {
      settle();
    } else {
      draw();
      wake();
    }

    const observer = new ResizeObserver(() => {
      const width = container.clientWidth;
      if (Math.abs(width - s.width) < 1) {
        return;
      }
      // Shift everything with the anchor so a resize does not jolt the rope.
      const shift = width / 2 - s.anchorX;
      for (const point of [...s.rope, s.tail]) {
        point.x += shift;
        point.px += shift;
      }
      s.anchorX = width / 2;
      s.width = width;
      s.fit = fitScale(width, cardWidth);
      if (s.reduceMotion) {
        draw();
      } else {
        wake();
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.last = 0;
    };
  }, [layout, draw, wake, settle, dropIn, cardWidth]);

  const localPoint = (event: PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    return {
      x: event.clientX - (rect?.left ?? 0),
      y: event.clientY - (rect?.top ?? 0),
    };
  };

  const toggleFlip = () => {
    if (!back) {
      return;
    }
    flippedRef.current = !flippedRef.current;
    setFlipped(flippedRef.current);
    draw();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    const point = localPoint(event);
    s.downAt = point;
    s.moved = false;
    if (s.reduceMotion) {
      return;
    }
    const end = s.rope[SEGMENTS];
    if (!end) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    // How far down the card the grab is, from the clip (0) to the bottom (1).
    const ax = s.tail.x - end.x;
    const ay = s.tail.y - end.y;
    const cardLength = CLIP + cardHeight * s.fit;
    const along =
      ((point.x - end.x) * ax + (point.y - end.y) * ay) /
      (cardLength * cardLength);
    s.grab = Math.max(0.1, Math.min(0.95, along));
    s.pointer = point;
    s.dragging = true;
    wake();
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    if (!s.dragging) {
      return;
    }
    s.pointer = localPoint(event);
    if (
      Math.hypot(s.pointer.x - s.downAt.x, s.pointer.y - s.downAt.y) >
      CLICK_SLOP
    ) {
      s.moved = true;
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    const wasDragging = s.dragging;
    s.dragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!s.moved) {
      toggleFlip();
    }
    if (wasDragging) {
      wake();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
      return;
    }
    const push = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (push && !sim.current.reduceMotion) {
      event.preventDefault();
      // Moving the previous position back gives the card a sideways kick.
      sim.current.tail.px -= push * 16;
      wake();
    }
  };

  const strapId = `lanyard-strap-${id}`;

  return (
    <div
      className={cn(
        "relative h-[560px] w-full touch-none select-none overflow-hidden",
        className,
      )}
      data-slot="lanyard-badge"
      ref={containerRef}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible text-foreground"
      >
        <path
          d=""
          fill="none"
          id={strapId}
          ref={strapRef}
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="18"
        />
        <text
          className="fill-background font-semibold"
          dominantBaseline="central"
          fontSize="9"
          letterSpacing="2.4"
        >
          <textPath href={`#${strapId}`} startOffset="6">
            {`${strapText}  `.repeat(12)}
          </textPath>
        </text>
        <g ref={clipRef}>
          <rect
            className="fill-muted-foreground/70"
            height="10"
            rx="3"
            width="26"
            x="-13"
            y="-4"
          />
          <rect
            className="fill-muted-foreground"
            height={CLIP - 2}
            rx="2"
            width="8"
            x="-4"
            y="2"
          />
        </g>
      </svg>

      {/* biome-ignore lint/a11y/useSemanticElements: the card holds any content, links included, which a button element cannot */}
      <div
        aria-label={
          back
            ? "Badge. Press Enter to flip it, or the arrow keys to swing it."
            : "Badge. Press the arrow keys to swing it."
        }
        aria-pressed={back ? flipped : undefined}
        className="absolute top-0 left-0 origin-top cursor-grab rounded-lanyard outline-none [transform-style:preserve-3d] focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 active:cursor-grabbing"
        onKeyDown={onKeyDown}
        onPointerCancel={onPointerUp}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        ref={cardRef}
        role="button"
        style={{ width: cardWidth, height: cardHeight }}
        tabIndex={0}
      >
        <div className="relative size-full rounded-lanyard [transform-style:preserve-3d]">
          <div className="absolute inset-0 overflow-hidden rounded-lanyard border bg-card text-card-foreground shadow-lanyard [backface-visibility:hidden]">
            {front}
            <CardSlot />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[length:250%_100%] bg-linear-105 from-35% from-transparent via-50% via-sheen to-65% to-transparent mix-blend-soft-light"
              ref={shineRef}
            />
          </div>
          {back ? (
            <div className="absolute inset-0 overflow-hidden rounded-lanyard border bg-card text-card-foreground shadow-lanyard [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {back}
              <CardSlot />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** The slot the clip goes through, punched into each face. */
function CardSlot() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-3 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-muted shadow-lanyard-slot"
    />
  );
}
