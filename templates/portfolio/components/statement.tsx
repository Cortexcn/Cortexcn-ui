"use client";

import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { site } from "@/config/site";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    // Reduced motion shows every word at full strength from the start.
    <motion.span
      className="mr-[0.25em] inline-block motion-reduce:opacity-100!"
      style={{ opacity }}
    >
      {children}
    </motion.span>
  );
}

/** A short statement that lights up word by word as it scrolls past. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });
  const words = site.statement.split(" ");

  return (
    <section className="px-6 py-28 md:py-40">
      <p
        className="mx-auto max-w-4xl text-balance text-center font-medium text-3xl leading-[1.15] tracking-tight md:text-5xl"
        ref={ref}
      >
        {words.map((word, index) => (
          <Word
            key={`${index}-${word}`}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
          >
            {word}
          </Word>
        ))}
      </p>
    </section>
  );
}
