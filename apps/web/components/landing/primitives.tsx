import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the marketing landing page, styled to match the
 * Syntiq template: dark navy surfaces, a warm orange accent, rounded cards, and
 * Manrope / IBM Plex Mono type. Every section composes these so the whole page
 * stays consistent. The palette and fonts come from the `.syntiq` scope in
 * globals.css, applied on the home layout wrapper.
 */

/** Primary CTA: light pill with dark text, echoing the template's hero buttons. */
export const accentButtonClassName =
  "rounded-full border-transparent bg-foreground text-background shadow-sm hover:bg-white";

/** Secondary CTA: quiet outline pill on the dark surface. */
export const secondaryButtonClassName =
  "rounded-full border-white/15 bg-white/5 text-foreground hover:bg-white/10";

/** Orange accent CTA, used for the pricing "get in touch" and key actions. */
export const orangeButtonClassName =
  "rounded-full border-transparent bg-primary text-primary-foreground shadow-[0_8px_24px_-8px_var(--syntiq-accent)] hover:brightness-110";

/** Inline emphasis color (warm orange). */
export const accentTextClassName = "text-primary";

/** Card / panel surface. */
export const surfaceClassName =
  "rounded-[20px] border border-border bg-card shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]";

/**
 * Base button shape for links rendered inside server components. Avoids importing
 * the client-only `buttonVariants` (button.tsx is "use client", so calling it from
 * a server component throws). Layer `accentButtonClassName` / `secondaryButtonClassName`.
 */
export const linkButtonBaseClassName =
  "inline-flex h-12 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent px-6 font-medium text-base outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Section({
  className,
  bordered = false,
  ...props
}: React.ComponentProps<"section"> & { bordered?: boolean }) {
  return (
    <section
      className={cn(
        "py-20 md:py-28",
        bordered && "border-border/60 border-t",
        className,
      )}
      {...props}
    />
  );
}

export function Surface({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn(surfaceClassName, className)} {...props} />;
}

/** Small bracketed mono chip used above section titles (Syntiq "eyebrow" style). */
export function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-medium font-mono text-muted-foreground text-xs uppercase tracking-[0.18em]",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleId,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
  titleId?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className="max-w-3xl text-balance font-semibold text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-[3.5rem]"
        id={titleId}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-balance text-base text-muted-foreground sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
