"use client";

import { useInView } from "motion/react";
import { type CSSProperties, type ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";

/** Starts once, when a fifth of the element has scrolled into view. */
function useRevealState<T extends Element>() {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return { ref, state: inView ? "shown" : "pending" } as const;
}

/**
 * Fades and lifts its children in the first time they scroll into view. The
 * hidden state is CSS (`.ui-rise` in globals.css), so reduced motion and
 * no-JS visitors always see the content.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Milliseconds to wait after the element enters the view. */
  delay?: number;
}) {
  const { ref, state } = useRevealState<HTMLDivElement>();

  return (
    <div
      className={cn("ui-rise", className)}
      data-reveal={state}
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export interface HeadingLine {
  text: string;
  /** The quiet half of a two-tone heading. */
  muted?: boolean;
}

/** Each word of each line as its own span, numbered for the stagger. */
export function HeadingWords({
  lines,
  breakLines = false,
  enterOnLoad = false,
  mutedClassName = "text-(--heading-muted)",
}: {
  lines: HeadingLine[];
  /**
   * Start each line on its own row. Each row is its own balanced block, since
   * browsers do not balance the text after a forced `<br>`.
   */
  breakLines?: boolean;
  /** Animate on page load instead of waiting for the view (for the hero). */
  enterOnLoad?: boolean;
  mutedClassName?: string;
}) {
  let wordIndex = 0;

  return (
    <>
      {lines.map((line, lineIndex) => (
        <span
          className={cn(
            breakLines && "block text-balance",
            line.muted && mutedClassName,
          )}
          key={line.text}
        >
          {lineIndex > 0 && !breakLines ? " " : null}
          {line.text.split(" ").map((word, index) => {
            const style = { "--word-index": wordIndex } as CSSProperties;
            wordIndex += 1;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: words are positional and never reorder
              <span key={index}>
                {index > 0 ? " " : null}
                <span
                  className={cn("ui-word", enterOnLoad && "ui-word-enter")}
                  style={style}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

/** A heading whose words rise in, one after another, once it is in view. */
export function RevealHeading({
  as: Tag = "h2",
  lines,
  breakLines = true,
  className,
}: {
  as?: "h2" | "h3";
  lines: HeadingLine[];
  breakLines?: boolean;
  className?: string;
}) {
  const { ref, state } = useRevealState<HTMLHeadingElement>();

  return (
    <Tag className={className} data-reveal={state} ref={ref}>
      <HeadingWords breakLines={breakLines} lines={lines} />
    </Tag>
  );
}
