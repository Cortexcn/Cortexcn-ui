"use client";

import type { Transition } from "motion/react";
import {
  AnimatePresence,
  motion,
  useInView,
  usePageInView,
  useReducedMotion,
} from "motion/react";
import type { ReactNode } from "react";
import { Children, memo, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const DEFAULT_COLUMN_COUNT = 4;

/** How long each logo stays visible before cycling to the next one (ms). */
const CYCLE_INTERVAL = 2400;

/**
 * Delay between adjacent columns within a single wave (ms). Kept smaller than
 * the enter/exit duration so neighbouring transitions overlap into a ripple.
 */
const STAGGER_DELAY = 125;

/** Duration of a single enter or exit transition (s). */
const TRANSITION_DURATION = 0.5;

const EASE_OUT_QUAD = [0.25, 0.46, 0.45, 0.94] as const;

/** Direction the wave sweeps across the columns. */
type WaveDirection = "ltr" | "rtl";

export interface LogosCarouselProps {
  /** Logo elements to cycle through. Each child is rendered as a single logo. */
  children: ReactNode;
  /**
   * Number of columns to spread the logos across. Capped at the number of logos.
   * @defaultValue 4
   */
  columnCount?: number;
  /**
   * Direction the ripple travels: left-to-right or right-to-left.
   * @defaultValue "ltr"
   */
  direction?: WaveDirection;
  className?: string;
}

export function LogosCarousel({
  children,
  columnCount = DEFAULT_COLUMN_COUNT,
  direction = "ltr",
  className,
}: LogosCarouselProps) {
  const columns = useMemo(
    () => distributeLogos(Children.toArray(children), columnCount),
    [children, columnCount],
  );

  const reduceMotion = useReducedMotion() ?? false;

  const containerRef = useRef<HTMLDivElement>(null);
  const isPageInView = usePageInView();
  const isInView = useInView(containerRef, { margin: "100px" });

  const [step, setStep] = useState(0);
  const shouldPlay = isPageInView && isInView;

  useEffect(() => {
    if (!shouldPlay) {
      return;
    }

    const beatId = setInterval(
      () => setStep((prev) => prev + 1),
      CYCLE_INTERVAL,
    );

    return () => clearInterval(beatId);
  }, [shouldPlay]);

  return (
    <div
      className={cn("grid", className)}
      data-slot="logos-carousel"
      ref={containerRef}
      style={{
        gridTemplateColumns: `repeat(var(--column-count,${columns.length}), minmax(0, 1fr))`,
      }}
    >
      {columns.map((columnLogos, columnIndex) => {
        const waveIndex =
          direction === "rtl" ? columns.length - 1 - columnIndex : columnIndex;

        return (
          <LogoColumn
            activeIndex={step % columnLogos.length}
            columnIndex={columnIndex}
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional and never reorder
            key={columnIndex}
            logos={columnLogos}
            reduceMotion={reduceMotion}
            waveIndex={waveIndex}
          />
        );
      })}
    </div>
  );
}

interface LogoColumnProps {
  logos: ReactNode[];
  columnIndex: number;
  waveIndex: number;
  activeIndex: number;
  reduceMotion: boolean;
}

const LogoColumn = memo(function LogoColumn({
  logos,
  columnIndex,
  waveIndex,
  activeIndex,
  reduceMotion,
}: LogoColumnProps) {
  const transition: Transition = {
    ease: EASE_OUT_QUAD,
    duration: TRANSITION_DURATION,
    delay: waveIndex * (STAGGER_DELAY / 1000),
  };

  const column = getColumnVariants(reduceMotion);
  const logo = getLogoVariants(reduceMotion, transition);

  return (
    <motion.div
      animate={column.animate}
      className="relative"
      data-slot="logos-carousel-column"
      initial={column.initial}
      transition={transition}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          animate={logo.animate}
          className="flex size-full items-center justify-center"
          data-slot="logos-carousel-logo"
          exit={logo.exit}
          initial={logo.initial}
          key={`${columnIndex}-${activeIndex}`}
        >
          {logos[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});

/**
 * Under reduced motion every variant collapses to a plain opacity cross-fade.
 * The logos still cycle, so no logo is dropped from the run; only the travel
 * and blur that can trigger vestibular discomfort are removed.
 */
function getColumnVariants(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    };
  }

  return {
    initial: { opacity: 0, transform: "translateY(60%)" },
    animate: { opacity: 1, transform: "translateY(0%)" },
  };
}

function getLogoVariants(reduceMotion: boolean, transition: Transition) {
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition },
      exit: { opacity: 0, transition },
    };
  }

  return {
    initial: { opacity: 0, transform: "translateY(60%)", filter: "blur(2px)" },
    animate: {
      opacity: 1,
      transform: "translateY(0%)",
      filter: "blur(0px)",
      transition,
    },
    exit: {
      opacity: 0,
      transform: "translateY(-50%)",
      filter: "blur(3px)",
      transition,
    },
  };
}

function distributeLogos(
  logos: ReactNode[],
  columnCount: number,
): ReactNode[][] {
  const effectiveCount = Math.min(columnCount, logos.length);
  const columns: ReactNode[][] = Array.from(
    { length: effectiveCount },
    () => [],
  );

  logos.forEach((logo, index) => {
    columns[index % effectiveCount]?.push(logo);
  });

  return columns;
}
