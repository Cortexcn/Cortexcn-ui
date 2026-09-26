import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the marketing landing page: square boxes, thin
 * borders, a violet accent, Geist for copy, and Geist Mono for uppercase labels
 * and buttons. Every section composes these so the whole page stays consistent.
 * The palette and fonts come from the `.syntiq` scope in globals.css, applied on
 * the home layout wrapper, and follow the site light/dark toggle.
 */

/** Primary CTA: solid box in the text color. */
export const accentButtonClassName =
  "border-transparent bg-foreground text-background hover:bg-primary hover:text-primary-foreground";

/** Secondary CTA: outlined box on the page surface. */
export const secondaryButtonClassName =
  "border-border bg-background text-foreground hover:bg-muted";

/** Violet accent CTA, used for the pricing "get in touch" and key actions. */
export const primaryButtonClassName =
  "border-transparent bg-primary text-primary-foreground hover:brightness-110";

/** Inline emphasis color (violet). */
export const accentTextClassName = "text-primary";

/** Card / panel surface. */
export const surfaceClassName = "border border-border bg-card";

/**
 * Base button shape for links rendered inside server components. Avoids importing
 * the client-only `buttonVariants` (button.tsx is "use client", so calling it from
 * a server component throws). Layer `accentButtonClassName` / `secondaryButtonClassName`.
 */
export const linkButtonBaseClassName =
  "inline-flex h-12 shrink-0 select-none items-center justify-center gap-3 whitespace-nowrap rounded-none border border-transparent px-6 font-medium font-mono text-sm uppercase outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1264px] px-4 sm:px-6 lg:px-8",
        className,
      )}
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

/** Mono uppercase label with a square accent, used above section titles. */
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
        "inline-flex items-center gap-2.5 font-mono text-muted-foreground text-sm uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-2 bg-primary" />
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
        className="max-w-3xl text-balance font-medium text-4xl leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-[3.5rem]"
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
