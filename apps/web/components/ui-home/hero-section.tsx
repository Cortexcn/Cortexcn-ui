import Link from "next/link";

import { cn } from "@/lib/utils";

import { HeroDashboard } from "./hero-dashboard";
import { Painting } from "./painting";
import {
  ChevronRightIcon,
  Container,
  PrimaryLink,
  SecondaryLink,
} from "./primitives";
import { HeadingWords } from "./reveal";
import { StackTicker } from "./stack-ticker";

const ANNOUNCEMENT = {
  tag: "New",
  text: "Command Search and Number Ticker are live",
  href: "/docs/cortex/command-search",
};

const HEADLINE = [
  { text: "The component library" },
  { text: "that lives in your repo.", muted: true },
];

/** CSS-only entrance, so the copy animates in before hydration finishes. */
const enterClassName =
  "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 ease-out motion-reduce:animate-none";

export function HeroSection() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-20" id="hero">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:gap-14">
        <div className="flex flex-col items-start">
          <Link
            className={cn(
              "group mb-7 inline-flex items-center gap-2.5 text-base text-body",
              enterClassName,
            )}
            href={ANNOUNCEMENT.href}
          >
            <span className="rounded-[4px] bg-muted px-1.5 py-1 font-medium text-xs uppercase leading-none">
              {ANNOUNCEMENT.tag}
            </span>
            <span className="underline-offset-4 group-hover:underline">
              {ANNOUNCEMENT.text}
            </span>
            <ChevronRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <h1 className="text-balance font-light font-sentient text-[46px] leading-[1.05] tracking-[-0.05em] md:text-5xl lg:text-[56px]">
            <HeadingWords
              enterOnLoad
              lines={HEADLINE}
              mutedClassName="text-body"
            />
          </h1>

          <p
            className={cn(
              "mt-6 max-w-[30rem] text-pretty text-body text-lg leading-[1.4] delay-300",
              enterClassName,
            )}
          >
            Charts, blocks, and motion components for shadcn/ui. Add them with
            the shadcn CLI or your AI agent, then change the code however you
            like.
          </p>

          <div
            className={cn(
              "mt-9 flex flex-wrap items-center gap-3 delay-500",
              enterClassName,
            )}
          >
            <PrimaryLink href="/docs/components">Browse components</PrimaryLink>
            <SecondaryLink href="/docs/installation">
              Read the docs
            </SecondaryLink>
          </div>
        </div>

        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-2xl border border-border delay-200 sm:aspect-square",
            enterClassName,
          )}
        >
          <Painting
            art="wildflower-meadow"
            preload
            sizes="(min-width: 1280px) 660px, (min-width: 1024px) 55vw, 100vw"
          />
          <HeroDashboard className="absolute top-6 left-6 sm:top-10 sm:left-10 lg:top-12 lg:left-12" />
        </div>
      </Container>

      <StackTicker />
    </section>
  );
}
