"use client";

import Link from "next/link";
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/*
 * Shared pieces for the landing sections: the numbered section label, the
 * type-in headings, the square action button, index marks, the dot texture,
 * and pixel art. Colors come from the `.syntiq` tokens in globals.css.
 */

/** Numbered sections, in page order; drives the "[N.01/06]" labels. */
export const NUMBERED_SECTIONS = [
  "benefits",
  "capabilities",
  "installation",
  "services",
  "pricing",
  "changelog",
  "faq",
] as const;

export type NumberedSection = (typeof NUMBERED_SECTIONS)[number];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** "[N.01/06] —— > LABEL ————" row that opens every numbered section. */
export function SectionLabel({
  section,
  label,
  className,
}: {
  section: NumberedSection;
  label: string;
  className?: string;
}) {
  const index = NUMBERED_SECTIONS.indexOf(section) + 1;
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-medium font-mono text-sm uppercase leading-[1.3] tracking-[-0.04em]",
        className,
      )}
    >
      <span className="shrink-0 text-label-strong">
        [N.{pad(index)}/
        <span className="text-label-weak">{pad(NUMBERED_SECTIONS.length)}</span>
        ]
      </span>
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-border" />
      <span className="shrink-0 text-label-strong">&gt; {label}</span>
      <span aria-hidden="true" className="ml-2 h-px min-w-6 flex-1 bg-border" />
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Type-in: text types left to right with a flickering glyph at the front.  */
/* ------------------------------------------------------------------------ */

export const SCRAMBLE_CHARS = "{}[]<>/_#+=*?!";

/** Deterministic flicker glyph, so renders stay pure. Changes every 40ms. */
export function scrambleChar(elapsed: number | null, seed: number) {
  const step = elapsed === null ? 0 : Math.floor(elapsed / 40);
  const hash = (step * 7919 + seed * 104_729 + step * seed * 31) % 9973;
  return SCRAMBLE_CHARS[hash % SCRAMBLE_CHARS.length] ?? "_";
}

/**
 * Plays a type-in once the element scrolls into view and returns the elapsed
 * time, or null when the full text should show (server render, reduced
 * motion, finished).
 */
export function useTypeInOnView<T extends Element>(
  durationMs: number,
  threshold = 0.6,
) {
  const ref = useRef<T>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    setElapsed(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const time = now - start;
          if (time >= durationMs) {
            setElapsed(null);
            return;
          }
          setElapsed(time);
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [durationMs, threshold]);

  return { ref, elapsed };
}

/** Characters typed so far; -1 means this run has not started yet. */
export function typedCount(
  elapsed: number | null,
  startMs: number,
  length: number,
  charMs = 50,
) {
  if (elapsed === null) {
    return length;
  }
  const time = elapsed - startMs;
  if (time < 0) {
    return -1;
  }
  return Math.min(length, Math.floor(time / charMs));
}

/** Untyped letters stay in the layout (invisible), so nothing shifts. */
export function TypedText({
  text,
  typed,
  scramble,
}: {
  text: string;
  typed: number;
  scramble: string;
}) {
  if (typed >= text.length) {
    return text;
  }
  const started = typed >= 0;
  const shown = Math.max(typed, 0);
  return (
    <>
      {text.slice(0, shown)}
      {started ? <span>{scramble}</span> : null}
      <span className="invisible">{text.slice(started ? shown + 1 : 0)}</span>
    </>
  );
}

const HEADING_CHAR_MS = 35;
const HEADING_LINE_STAGGER_MS = 300;

/** Two-line section heading that types in when it scrolls into view. */
export function TypeHeading({
  lines,
  className,
  size = "section",
}: {
  lines: string[];
  className?: string;
  size?: "section" | "display";
}) {
  const duration = Math.max(
    ...lines.map(
      (line, index) =>
        index * HEADING_LINE_STAGGER_MS + (line.length + 1) * HEADING_CHAR_MS,
    ),
  );
  const { ref, elapsed } = useTypeInOnView<HTMLHeadingElement>(duration, 0.4);

  return (
    <h2
      className={cn(
        "font-normal text-foreground leading-[1.1] tracking-[-0.06em]",
        size === "section"
          ? "text-[2.5rem] sm:text-5xl lg:text-[3.5rem]"
          : "text-[2.75rem] sm:text-6xl lg:text-[4rem]",
        className,
      )}
      ref={ref}
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {lines.map((line, index) => (
        <span aria-hidden="true" className="block" key={line}>
          <TypedText
            scramble={scrambleChar(elapsed, index + 1)}
            text={line}
            typed={typedCount(
              elapsed,
              index * HEADING_LINE_STAGGER_MS,
              line.length,
              HEADING_CHAR_MS,
            )}
          />
        </span>
      ))}
    </h2>
  );
}

/**
 * Re-types a label from left to right with flickering glyphs, on demand (for
 * example on hover). Monospace text keeps the width steady while it runs.
 */
export function useScrambleText(text: string, charMs = 30) {
  const [elapsed, setElapsed] = useState<number | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const play = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const tick = (now: number) => {
      const time = now - start;
      if (time >= text.length * charMs) {
        setElapsed(null);
        return;
      }
      setElapsed(time);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, charMs]);

  if (elapsed === null) {
    return [text, play] as const;
  }
  const resolved = Math.floor(elapsed / charMs);
  let display = text.slice(0, resolved);
  for (let index = resolved; index < text.length; index += 1) {
    display += text[index] === " " ? " " : scrambleChar(elapsed, index);
  }
  return [display, play] as const;
}

/* ------------------------------------------------------------------------ */
/* Action button                                                              */
/* ------------------------------------------------------------------------ */

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.5 8h10.5M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
    </svg>
  );
}

/** Solid for the main action, outline for a second action or a small header button. */
type ActionVariant = "solid" | "outline";
type ActionSize = "md" | "sm";

interface ActionStyle {
  block?: boolean;
  variant?: ActionVariant;
  size?: ActionSize;
}

function actionClassName(
  { block = false, variant = "solid", size = "md" }: ActionStyle,
  className?: string,
) {
  return cn(
    "group relative isolate inline-flex shrink-0 items-center justify-between overflow-hidden outline-none transition-colors duration-300 hover:text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
    variant === "solid"
      ? "bg-foreground text-background"
      : "border border-border bg-background text-foreground hover:border-primary",
    size === "md" ? "h-12 gap-8 px-4" : "h-9 gap-4 px-3",
    block && "w-full",
    !block && size === "md" && "min-w-45",
    className,
  );
}

function ActionContent({
  label,
  display,
  size = "md",
}: {
  label: string;
  display: string;
  size?: ActionSize;
}) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-1 -translate-x-full bg-primary transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0 group-disabled:translate-x-0 motion-reduce:transition-none"
      />
      <span aria-hidden="true" className="size-2 shrink-0 bg-current" />
      <span
        className={cn(
          "flex items-center font-mono font-semibold uppercase leading-[1.3] tracking-[-0.05em]",
          size === "md" ? "text-base" : "text-sm",
        )}
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden="true" className="whitespace-pre">
          {display}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "flex w-0 justify-end overflow-hidden transition-[width] duration-300 ease-out motion-reduce:transition-none",
            size === "md"
              ? "group-hover:w-6 group-focus-visible:w-6"
              : "group-hover:w-5 group-focus-visible:w-5",
          )}
        >
          <ArrowRightIcon
            className={cn("shrink-0", size === "md" ? "size-4" : "size-3.5")}
          />
        </span>
      </span>
    </>
  );
}

/**
 * Square button: a dot, a mono label, and on hover an accent fill that sweeps
 * in from the left while the label re-types and an arrow slides out.
 */
export function ActionLink({
  href,
  label,
  className,
  block,
  variant,
  size,
  ...props
}: Omit<ComponentProps<typeof Link>, "children"> &
  ActionStyle & {
    label: string;
  }) {
  const [display, play] = useScrambleText(label);
  return (
    <Link
      className={actionClassName({ block, variant, size }, className)}
      href={href}
      onFocus={play}
      onPointerEnter={play}
      {...props}
    >
      <ActionContent display={display} label={label} size={size} />
    </Link>
  );
}

/** `ActionLink` as a real button, for forms. The fill stays while it is disabled. */
export function ActionButton({
  label,
  className,
  block,
  variant,
  size,
  type = "button",
  ...props
}: Omit<ComponentProps<"button">, "children"> &
  ActionStyle & {
    label: string;
  }) {
  const [display, play] = useScrambleText(label);
  return (
    <button
      className={actionClassName(
        { block, variant, size },
        cn("disabled:cursor-wait disabled:text-primary-foreground", className),
      )}
      onFocus={play}
      onPointerEnter={play}
      type={type}
      {...props}
    >
      <ActionContent display={display} label={label} size={size} />
    </button>
  );
}

/* ------------------------------------------------------------------------ */
/* Small marks                                                               */
/* ------------------------------------------------------------------------ */

/** "//001" index mark used on cards, tabs, and list rows. */
export function IndexMark({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "whitespace-nowrap font-medium text-base leading-[1.3] tracking-[-0.05em]",
        className,
      )}
    >
      <span className="text-faint">{"//"}</span>
      <span className="text-body">{String(value).padStart(3, "0")}</span>
    </span>
  );
}

/** Mono uppercase tag on a light panel ("LESS WORK, MORE OUTPUT"). */
export function MonoTag({
  children,
  className,
  size = "sm",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "xs";
}) {
  return (
    <span
      className={cn(
        "inline-block bg-muted font-medium font-mono uppercase leading-[1.3]",
        size === "sm"
          ? "py-1 text-muted-foreground text-sm tracking-[-0.04em]"
          : "px-0.5 py-0.5 text-body text-xs tracking-[-0.04em]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** 2px diamonds on a 7.09px grid, masked so the dot color follows the theme. */
const DOT_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7.092' height='7.092'%3E%3Cpath d='M3.5 2.5l1 1-1 1-1-1z'/%3E%3C/svg%3E\")";

export function DotTexture({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 bg-[color-mix(in_oklab,var(--foreground)_20%,transparent)]",
        className,
      )}
      style={{ maskImage: DOT_TEXTURE, maskSize: "7.092px 7.092px" }}
    />
  );
}

/**
 * Pixel art from rows of characters: `#` is a filled cell, `+` an outlined
 * cell, anything else is empty. Drawn in currentColor.
 */
export function PixelArt({
  rows,
  className,
}: {
  rows: readonly string[];
  className?: string;
}) {
  const columns = Math.max(...rows.map((row) => row.length));
  const filled: string[] = [];
  const outlined: string[] = [];
  rows.forEach((row, y) => {
    Array.from(row).forEach((cell, x) => {
      if (cell === "#") {
        filled.push(`M${x} ${y}h1v1h-1z`);
      } else if (cell === "+") {
        outlined.push(`M${x} ${y}h1v1h-1z`);
      }
    });
  });

  return (
    <svg
      aria-hidden="true"
      className={className}
      shapeRendering="crispEdges"
      viewBox={`0 0 ${columns} ${rows.length}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={filled.join("")} fill="currentColor" />
      <path
        d={outlined.join("")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
