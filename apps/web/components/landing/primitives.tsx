import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared building blocks for the marketing landing page, styled to match the
 * AgentLab template: light editorial look, serif display headings, and a
 * monochrome (black/cream) UI accent. Every section composes these so the whole
 * page stays consistent.
 */

/** Primary CTA color: solid black (foreground) button. Layer over `linkButtonBaseClassName`. */
export const accentButtonClassName =
  "rounded-[10px] border-transparent bg-foreground text-background shadow-sm hover:bg-foreground/90";

/** Secondary CTA color: quiet outline button. Layer over `linkButtonBaseClassName`. */
export const secondaryButtonClassName =
  "rounded-[10px] border-border bg-transparent text-foreground hover:bg-muted";

/** Inline emphasis color (monochrome). */
export const accentTextClassName = "text-foreground";

/** Card / panel surface. */
export const surfaceClassName = "rounded-[14px] border border-border bg-card";

/**
 * Base button shape for links rendered inside server components. Avoids importing
 * the client-only `buttonVariants` (button.tsx is "use client", so calling it from
 * a server component throws). Layer `accentButtonClassName` / `secondaryButtonClassName`.
 */
export const linkButtonBaseClassName =
  "inline-flex h-12 shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-[10px] border border-transparent px-5 font-medium text-base outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

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

/** Small mono pill used above section titles (AgentLab "eyebrow" style). */
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
        "inline-flex items-center gap-2 font-medium font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-foreground" />
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
        className="max-w-3xl text-balance font-display font-normal text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl"
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
