"use client";

/*
 * Adapted from the beUI Number Ticker (https://beui.dev).
 * MIT License, Copyright (c) 2026 Saurabh Chauhan.
 * https://github.com/starc007/ui-components/blob/main/LICENSE
 */

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export interface NumberTickerProps {
  value: number;
  /** Digits to pad to, on the left. */
  pad?: number;
  /** Per-digit roll duration in seconds. */
  duration?: number;
  /** Stagger between digits, in seconds. */
  stagger?: number;
  /** Roll in only once the element scrolls into view. */
  startOnView?: boolean;
  prefix?: string;
  suffix?: string;
  /** Add a small blur while the digits roll. */
  blur?: boolean;
  className?: string;
  digitClassName?: string;
  /** Insert locale group separators (commas). Safe in server components. */
  locale?: boolean;
  /** Custom formatter. Client only; server components should use `locale`. */
  format?: (value: number) => string;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const DIGIT_HEIGHT_EM = 1.1;
const DIGITS = Array.from({ length: 10 }, (_, n) => n);
const DIGIT_RE = /\d/;

function formatValue(
  value: number,
  pad: number | undefined,
  locale: boolean | undefined,
  format: ((value: number) => string) | undefined,
) {
  const rounded = Math.round(value);
  let formatted = rounded.toString();
  if (format) {
    formatted = format(rounded);
  } else if (locale) {
    formatted = rounded.toLocaleString();
  }
  return pad ? formatted.padStart(pad, "0") : formatted;
}

export function NumberTicker({
  value,
  pad,
  duration = 0.9,
  stagger = 0.04,
  startOnView = true,
  prefix,
  suffix,
  blur = false,
  className,
  digitClassName,
  locale,
  format,
}: NumberTickerProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.6 });
  const [armed, setArmed] = useState(!startOnView);

  useEffect(() => {
    if (startOnView && inView) {
      setArmed(true);
    }
  }, [startOnView, inView]);

  const text = useMemo(
    () => formatValue(value, pad, locale, format),
    [value, pad, format, locale],
  );
  const glyphs = useMemo(() => {
    const chars = text.split("");
    // Key by place value (position from the right): a changing digit keeps its
    // identity and rolls to the new value instead of remounting from 0, and a
    // growing number adds glyphs on the left without re-keying the others.
    return chars.map((char, index) => ({
      char,
      id: `g-${chars.length - 1 - index}`,
    }));
  }, [text]);
  const readableText = `${prefix ?? ""}${text}${suffix ?? ""}`;

  // The stagger is an entrance flourish. Once it has played, later value
  // changes roll every digit at once, since a per-digit delay on live
  // updates reads as lag.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!armed || entered) {
      return;
    }
    const total = (duration + glyphs.length * stagger) * 1000;
    const timer = window.setTimeout(() => setEntered(true), total);
    return () => window.clearTimeout(timer);
  }, [armed, entered, duration, stagger, glyphs.length]);

  return (
    <span
      className={cn("inline-flex items-center tabular-nums", className)}
      ref={containerRef}
    >
      <span className="sr-only">{readableText}</span>
      <span aria-hidden="true" className="inline-flex items-center">
        {prefix ? <span>{prefix}</span> : null}
        {glyphs.map(({ char, id }, index) => {
          if (!DIGIT_RE.test(char)) {
            return (
              <span className="inline-block" key={id}>
                {char}
              </span>
            );
          }
          return (
            <Digit
              blur={blur}
              className={digitClassName}
              delay={entered ? 0 : index * stagger}
              digit={armed ? Number(char) : 0}
              duration={duration}
              key={id}
            />
          );
        })}
        {suffix ? <span>{suffix}</span> : null}
      </span>
    </span>
  );
}

function Digit({
  digit,
  delay,
  duration,
  blur,
  className,
}: {
  digit: number;
  delay: number;
  duration: number;
  blur: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const columnRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = columnRef.current;
    if (reduce || !blur || !node || !Number.isFinite(digit)) {
      return;
    }
    const controls = animate(
      node,
      { filter: ["blur(10px)", "blur(0px)"] },
      { duration: Math.min(duration * 0.75, 0.32), delay, ease: EASE_OUT },
    );
    return () => {
      controls.stop();
      node.style.filter = "blur(0px)";
    };
  }, [blur, delay, digit, duration, reduce]);

  return (
    <span
      className={cn("relative inline-block overflow-hidden", className)}
      style={{ height: `${DIGIT_HEIGHT_EM}em`, width: "1ch" }}
    >
      <motion.span
        animate={{ y: `-${digit * DIGIT_HEIGHT_EM}em` }}
        className="absolute inset-x-0 top-0 flex flex-col items-center will-change-[transform,filter]"
        initial={{ y: 0 }}
        ref={columnRef}
        transition={
          reduce ? { duration: 0 } : { duration, delay, ease: EASE_OUT }
        }
      >
        {DIGITS.map((n) => (
          <span
            className="flex h-[1.1em] items-center justify-center leading-none"
            key={n}
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
