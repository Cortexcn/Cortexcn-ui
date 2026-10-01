"use client";

import type { ReactNode } from "react";
import { HomeHeroSection } from "@/components/design/home-hero-section";
import { InteractiveGrid } from "@/components/landing/interactive-grid";
import { cn } from "@/lib/utils";

export function SubPageHeroGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <HomeHeroSection>
      <div className="w-full overflow-visible pt-8 md:pt-16">
        <div
          className={cn(
            "relative aspect-3/1 min-h-64 w-full overflow-hidden border border-border md:aspect-4/1",
            className,
          )}
        >
          {/* The landing's hover grid. `syntiq` brings its violet cells; the band
              and line colors are the light ones the landing title band uses. */}
          <div aria-hidden="true" className="syntiq absolute inset-0">
            <InteractiveGrid className="absolute inset-0 [--band-line:var(--border)] [--band:var(--muted)]" />
          </div>
          {children}
        </div>
      </div>
    </HomeHeroSection>
  );
}

export function GridPageHero({
  title,
  subtitle,
  action,
  art,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  /** A picture for the right side of the band, shown from md up. */
  art?: ReactNode;
}) {
  return (
    <SubPageHeroGrid
      className={art ? "md:aspect-auto md:h-104 lg:h-112" : undefined}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex min-h-0 min-w-0 flex-col justify-center px-4 text-left sm:px-8 md:px-12",
          art && "md:pr-[52%]",
        )}
        data-grid-fill
      >
        <div className="flex flex-col items-start gap-3 sm:gap-4">
          <div className="flex max-w-full flex-col items-start">
            <h1 className="font-bold text-2xl tracking-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest sm:text-sm md:text-base">
              {subtitle}
              <span className="animate-caret-blink">_</span>
            </p>
          </div>
          {action ? <div className="pointer-events-auto">{action}</div> : null}
        </div>
      </div>
      {art ? (
        <div className="absolute inset-y-6 right-6 hidden w-[46%] max-w-xl md:block lg:inset-y-8 lg:right-8">
          {art}
        </div>
      ) : null}
    </SubPageHeroGrid>
  );
}
