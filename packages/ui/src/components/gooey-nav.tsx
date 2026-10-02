"use client";

import {
  type MouseEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  /** Index of the item that starts active. */
  defaultIndex?: number;
  /** Called with the new index when an item is chosen. */
  onIndexChange?: (index: number) => void;
  /** Drops that pull away from the pill as it moves. */
  drops?: number;
  /** How long the pill takes to reach the new item, in milliseconds. */
  duration?: number;
  className?: string;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Layout {
  boxes: Box[];
  width: number;
}

interface EdgeTransitions {
  left: string;
  right: string;
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** No overshoot, so the leading edge never runs past the row. */
const LEAD_EASE = "cubic-bezier(0.25, 0.8, 0.25, 1)";
/** Overshoots inward, so the tail snaps past its mark and wobbles back. */
const TRAIL_EASE = "cubic-bezier(0.45, 0, 0.2, 1.25)";
const LEAD_SHARE = 0.55;
const TRAIL_SHARE = 0.6;
const TRAIL_DELAY_SHARE = 0.28;

/**
 * The edge facing the new item leaves first and the other follows a moment
 * later, so the pill stretches toward the item and snaps in behind itself.
 */
function edgeTransitions(
  direction: number,
  duration: number,
  reduceMotion: boolean,
): EdgeTransitions {
  if (reduceMotion) {
    const plain = `${Math.round(duration * 0.4)}ms ease-out`;
    return { left: plain, right: plain };
  }
  const lead = `${Math.round(duration * LEAD_SHARE)}ms ${LEAD_EASE}`;
  const trail = `${Math.round(duration * TRAIL_SHARE)}ms ${TRAIL_EASE} ${Math.round(duration * TRAIL_DELAY_SHARE)}ms`;
  return direction > 0
    ? { left: trail, right: lead }
    : { left: lead, right: trail };
}

/**
 * A row of links with one filled pill under the active item. Choosing another
 * item stretches the pill toward it through a goo filter, and the tail sheds a
 * few drops that it pulls back in when it lands.
 */
export function GooeyNav({
  items,
  defaultIndex = 0,
  onIndexChange,
  drops = 6,
  duration = 520,
  className,
}: GooeyNavProps) {
  const filterId = `gooey-nav-${useId().replace(/:/g, "")}`;
  const rowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const gooRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(defaultIndex);
  const [layout, setLayout] = useState<Layout>({ boxes: [], width: 0 });
  const [transitions, setTransitions] = useState<EdgeTransitions | null>(null);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }
    const origin = row.getBoundingClientRect();
    setLayout({
      width: origin.width,
      boxes: itemRefs.current.map((item) => {
        const rect = item?.getBoundingClientRect();
        return rect
          ? {
              left: rect.left - origin.left,
              top: rect.top - origin.top,
              width: rect.width,
              height: rect.height,
            }
          : { left: 0, top: 0, width: 0, height: 0 };
      }),
    });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: measure again when the items change
  useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) {
      return;
    }
    const observer = new ResizeObserver(() => {
      setTransitions(null);
      measure();
    });
    observer.observe(row);
    return () => observer.disconnect();
  }, [measure]);

  /**
   * Drops that ride the tail a few milliseconds apart. They string out behind
   * it while it moves fastest and melt back in as it lands.
   */
  const splash = (from: Box, to: Box) => {
    const goo = gooRef.current;
    if (!goo) {
      return;
    }
    const size = Math.min(from.height, to.height) * 0.6;
    // Sit each drop in the pill's round end, on the side it leaves from.
    const inset = (Math.min(from.height, to.height) - size) / 2;
    const rightward = to.left > from.left;
    const tailX = (box: Box) =>
      rightward ? box.left + inset : box.left + box.width - inset - size;
    const startX = tailX(from);
    const endX = tailX(to);
    const y = to.top + (to.height - size) / 2;
    for (let i = 0; i < drops; i++) {
      const drop = document.createElement("span");
      drop.className = "absolute top-0 left-0 rounded-full bg-current";
      Object.assign(drop.style, { width: `${size}px`, height: `${size}px` });
      goo.appendChild(drop);
      // Later drops lag more, run smaller, and sag a little off the line.
      const lag = (i + 1) / drops;
      const sag = (i % 2 === 0 ? 1 : -1) * lag * 3;
      const midX = startX + (endX - startX) / 2;
      const animation = drop.animate(
        [
          {
            transform: `translate(${startX}px, ${y}px) scale(${1 - lag * 0.35})`,
          },
          {
            transform: `translate(${midX}px, ${y + sag}px) scale(${0.9 - lag * 0.4})`,
            offset: 0.5,
          },
          { transform: `translate(${endX}px, ${y}px) scale(0.5)` },
        ],
        {
          duration: duration * TRAIL_SHARE,
          delay: duration * (TRAIL_DELAY_SHARE + lag * 0.07),
          easing: TRAIL_EASE,
          fill: "both",
        },
      );
      animation.onfinish = () => drop.remove();
    }
  };

  const choose = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
    if (items[index]?.href === "#") {
      event.preventDefault();
    }
    if (index === active) {
      return;
    }
    const from = layout.boxes[active];
    const to = layout.boxes[index];
    const reduceMotion = prefersReducedMotion();
    setTransitions(
      edgeTransitions(
        Math.sign((to?.left ?? 0) - (from?.left ?? 0)),
        duration,
        reduceMotion,
      ),
    );
    setActive(index);
    onIndexChange?.(index);
    if (from && to && !reduceMotion) {
      splash(from, to);
    }
  };

  const box = layout.boxes[active];
  const ready = Boolean(box && box.width > 0);
  const pill = box
    ? {
        top: box.top,
        height: box.height,
        left: box.left,
        right: layout.width - box.left - box.width,
        transition: transitions
          ? `left ${transitions.left}, right ${transitions.right}`
          : "none",
      }
    : undefined;

  return (
    <div
      className={cn(
        "-my-4 min-w-0 max-w-full overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      data-slot="gooey-nav"
    >
      <div className="relative w-max" ref={rowRef}>
        <svg aria-hidden="true" className="absolute size-0">
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="6" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="goo"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </svg>

        {/* The pill and its drops, melted together by the filter. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground"
          ref={gooRef}
          style={{ filter: `url(#${filterId})` }}
        >
          {pill ? (
            <span
              className="absolute rounded-full bg-current"
              style={{ ...pill, opacity: ready ? 1 : 0 }}
            />
          ) : null}
        </div>

        <nav className="relative">
          <ul className="flex items-center gap-1">
            {items.map((item, index) => (
              <li key={item.href + item.label}>
                <a
                  aria-current={index === active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-10 items-center whitespace-nowrap rounded-full px-5 font-medium text-muted-foreground text-sm outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50",
                    ready && "hover:text-foreground",
                    // Before the pill is measured, the active link fills itself.
                    !ready &&
                      index === active &&
                      "bg-foreground text-background",
                  )}
                  href={item.href}
                  onClick={(event) => choose(index, event)}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
          A window the shape of the pill, holding the labels in the pill's ink.
          The labels inside move against the window, so they stay in place.
        */}
        {ready && pill && box ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute overflow-hidden rounded-full text-background"
            style={pill}
          >
            <ul
              className="absolute flex items-center gap-1"
              style={{
                top: -box.top,
                left: -box.left,
                width: layout.width,
                transition: transitions ? `left ${transitions.left}` : "none",
              }}
            >
              {items.map((item) => (
                <li key={item.href + item.label}>
                  <span className="inline-flex h-10 items-center whitespace-nowrap px-5 font-medium text-sm">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
