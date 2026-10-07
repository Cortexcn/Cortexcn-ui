"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { CortexcnLogo } from "@/components/icons/cortexcn";
import { COMPONENT_COUNT_LABEL } from "@/lib/component-count";
import { cn } from "@/lib/utils";

import { InteractiveGrid } from "./interactive-grid";
import { ActionLink } from "./kit";
import { Container } from "./primitives";

/** What the agent builds; typed into the bracket in the headline, one by one. */
const BUILD_TARGETS = [
  "Landing Pages",
  "Dashboards",
  "Portfolios",
  "Storefronts",
  "Pricing Pages",
];

const TYPE_DELAY = 75;
const DELETE_DELAY = 40;
const HOLD_DELAY = 2000;
const NEXT_DELAY = 350;

/**
 * Starts with the first phrase fully shown (so the server HTML reads well),
 * then deletes it and types the next one, forever.
 */
function useTypewriter(phrases: string[]) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let phraseIndex = 0;
    let length = phrases[0]?.length ?? 0;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const phrase = phrases[phraseIndex] ?? "";
      if (deleting) {
        length -= 1;
        setText(phrase.slice(0, length));
        if (length <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          timer = setTimeout(tick, NEXT_DELAY);
          return;
        }
        timer = setTimeout(tick, DELETE_DELAY);
        return;
      }

      length += 1;
      setText(phrase.slice(0, length));
      if (length >= phrase.length) {
        deleting = true;
        timer = setTimeout(tick, HOLD_DELAY);
        return;
      }
      timer = setTimeout(tick, TYPE_DELAY);
    };

    timer = setTimeout(tick, HOLD_DELAY);
    return () => clearTimeout(timer);
  }, [phrases]);

  return text;
}

function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.25"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 1.5v8.5M2.75 6.75 6 10l3.25-3.25" />
    </svg>
  );
}

/** CSS-only entrance so the copy animates in before hydration finishes. */
const enterClassName =
  "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-700 ease-out motion-reduce:animate-none";

/** Dark band under the header: the interactive grid, the brand, and a scroll cue. */
function GridBand() {
  return (
    <div className="relative h-75 pt-(--site-header-height) text-(--band-foreground) md:h-90">
      <InteractiveGrid className="absolute inset-0" />

      {/* The row lets pointer events through so the grid under it still reacts. */}
      <Container className="pointer-events-none relative flex h-full flex-col justify-center gap-6 md:flex-row md:items-center md:justify-between">
        <div className={cn("flex items-center gap-3", enterClassName)}>
          <CortexcnLogo className="size-9 md:size-11" size={44} theme="dark" />
          <span className="font-medium text-4xl tracking-[-0.04em] md:text-5xl">
            Cortexcn
          </span>
          <span className="mt-1 self-center bg-(--band-line) px-1.5 py-0.5 font-mono text-(--band-foreground) text-xs uppercase">
            shadcn registry
          </span>
        </div>

        <a
          className={cn(
            "pointer-events-auto flex items-center gap-2 self-start font-mono text-(--band-muted) text-sm uppercase transition-colors delay-300 hover:text-(--band-foreground) md:self-auto",
            enterClassName,
          )}
          href="#hero-headline"
        >
          Scroll for more
          <ArrowDownIcon className="size-3 animate-scroll-cue motion-reduce:animate-none" />
        </a>
      </Container>
    </div>
  );
}

/** Tools the registry is built for; shown as small tiles in the proof row. */
const PROOF_LOGOS = [
  { name: "shadcn/ui", slug: "shadcn" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Cursor", slug: "cursor" },
];

function ProofRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground text-sm">
      <div className="flex">
        {PROOF_LOGOS.map((logo) => (
          <span
            className="-ml-px flex size-8 items-center justify-center border border-border bg-background first:ml-0"
            key={logo.slug}
            title={logo.name}
          >
            <Image
              alt={logo.name}
              className="size-4 dark:hidden"
              height={16}
              src={`/logos/stack/${logo.slug}-light.svg`}
              unoptimized
              width={16}
            />
            <Image
              alt=""
              className="hidden size-4 dark:block"
              height={16}
              src={`/logos/stack/${logo.slug}-dark.svg`}
              unoptimized
              width={16}
            />
          </span>
        ))}
      </div>
      <span>Built for shadcn/ui and Next.js</span>
      <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="size-2 bg-primary" />
        {COMPONENT_COUNT_LABEL} components
      </span>
    </div>
  );
}

function Headline() {
  const typed = useTypewriter(BUILD_TARGETS);

  return (
    <h1 className="font-medium text-[clamp(2.25rem,10.5vw,2.75rem)] leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem]">
      <span className={cn("block", enterClassName)}>Your AI agent ships</span>
      <span className="sr-only">
        landing pages, dashboards, portfolios, and storefronts
      </span>
      <span
        aria-hidden="true"
        className={cn(
          // Slightly smaller on phones so the longest phrase fits on one line.
          "flex items-center font-normal font-pixel text-[0.86em] text-primary tracking-normal delay-100 sm:text-[1em]",
          enterClassName,
        )}
      >
        <span className="whitespace-pre">[{typed}]</span>
        <span className="ml-1 inline-block h-[0.9em] w-[0.55em] animate-caret-blink bg-primary/25 motion-reduce:animate-none" />
      </span>
      <span className={cn("block delay-200", enterClassName)}>
        from real components.
      </span>
    </h1>
  );
}

export function HeroSection() {
  return (
    // Pulled up behind the fixed site header so the grid starts at the top edge.
    <section className="relative -mt-(--site-header-height) w-full">
      <GridBand />

      <Container
        className="grid scroll-mt-(--site-header-height) gap-10 pt-14 pb-16 md:pt-16 md:pb-20 xl:grid-cols-[minmax(0,1fr)_28rem] xl:gap-12"
        id="hero-headline"
      >
        <Headline />

        <div className="flex flex-col gap-7 xl:pt-3">
          <div className={cn("delay-300", enterClassName)}>
            <ProofRow />
          </div>

          <p
            className={cn(
              "max-w-md text-balance text-lg text-muted-foreground leading-relaxed delay-300",
              enterClassName,
            )}
          >
            Add components from the Cortexcn registry with one command, or let
            your AI agent pull them in. Real React code that you own and can
            change.
          </p>

          <div
            className={cn(
              "flex flex-col gap-3 delay-500 sm:flex-row sm:items-stretch",
              enterClassName,
            )}
          >
            <ActionLink href="/docs/installation" label="Get started" />
            <ActionLink
              className="flex-1"
              href="/docs/components"
              label="Browse components"
              variant="outline"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
