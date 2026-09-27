"use client";

import { motion } from "motion/react";
import type { RefObject } from "react";

import { cn } from "@/lib/utils";

/** Points for a star burst polygon in a 100x100 box. */
function burstPoints(points: number, outer: number, inner: number) {
  const coords: string[] = [];
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = (Math.PI * index) / points - Math.PI / 2;
    coords.push(
      `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`,
    );
  }
  return coords.join(" ");
}

const BURST = burstPoints(12, 47, 34);
const PETALS = Array.from({ length: 8 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 8;
  return { cx: 50 + 26 * Math.cos(angle), cy: 50 + 26 * Math.sin(angle) };
});

function Burst() {
  return (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 100 100">
      <polygon
        fill="var(--sticker-1)"
        points={BURST}
        stroke="var(--sticker-ink)"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <text
        fill="var(--sticker-ink)"
        fontFamily="var(--font-geist-sans)"
        fontSize="21"
        fontWeight="800"
        textAnchor="middle"
        x="50"
        y="58"
      >
        hi!
      </text>
    </svg>
  );
}

function Flower() {
  return (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 100 100">
      {PETALS.map((petal) => (
        <circle
          cx={petal.cx}
          cy={petal.cy}
          fill="var(--sticker-2)"
          key={`${petal.cx}-${petal.cy}`}
          r="20"
          stroke="var(--sticker-ink)"
          strokeWidth="2.5"
        />
      ))}
      <circle
        cx="50"
        cy="50"
        fill="var(--sticker-2)"
        r="24"
        stroke="var(--sticker-ink)"
        strokeWidth="2.5"
      />
      <circle cx="50" cy="50" fill="var(--sticker-ink)" r="7" />
    </svg>
  );
}

function Smile() {
  return (
    <svg aria-hidden="true" className="size-full" viewBox="0 0 120 64">
      <rect
        fill="var(--sticker-3)"
        height="58"
        rx="29"
        stroke="var(--sticker-ink)"
        strokeWidth="2.5"
        width="114"
        x="3"
        y="3"
      />
      <circle cx="44" cy="26" fill="var(--sticker-ink)" r="5" />
      <circle cx="76" cy="26" fill="var(--sticker-ink)" r="5" />
      <path
        d="M44 40c9 9 23 9 32 0"
        fill="none"
        stroke="var(--sticker-ink)"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

const STICKERS = [
  {
    key: "burst",
    Shape: Burst,
    className:
      "top-[16%] left-[6%] size-20 md:top-[18%] md:left-[10%] md:size-28",
    rotate: -12,
    delay: 0.5,
  },
  {
    key: "flower",
    Shape: Flower,
    className:
      "top-[14%] right-[6%] size-16 md:top-[20%] md:right-[12%] md:size-24",
    rotate: 16,
    delay: 0.65,
  },
  {
    key: "smile",
    Shape: Smile,
    className:
      "right-[14%] bottom-[16%] h-12 w-24 md:right-[22%] md:bottom-[18%] md:h-16 md:w-32",
    rotate: -8,
    delay: 0.8,
  },
];

/** Playful shapes around the hero title. Visitors can drag them around. */
export function Stickers({
  constraints,
}: {
  constraints: RefObject<HTMLElement | null>;
}) {
  return STICKERS.map((sticker, index) => (
    <motion.div
      animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
      className={cn(
        "absolute z-20 cursor-grab touch-none select-none active:cursor-grabbing",
        sticker.className,
      )}
      drag
      dragConstraints={constraints}
      dragElastic={0.2}
      initial={{ opacity: 0, scale: 0.4, rotate: sticker.rotate - 30 }}
      key={sticker.key}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
        delay: sticker.delay,
      }}
      whileDrag={{ scale: 1.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        className="size-full"
        transition={{
          duration: 5 + index,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <sticker.Shape />
      </motion.div>
    </motion.div>
  ));
}
