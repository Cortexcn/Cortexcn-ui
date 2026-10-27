import Link from "next/link";

import { cn } from "@/lib/utils";

import { HeroCanvasLoader } from "./hero-canvas-loader";
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
    <section className="pb-16 md:pb-20" id="hero">
      <div className="relative overflow-hidden">
        <Container className="relative z-10 flex items-center pt-28 pb-10 md:pt-36 lg:min-h-[min(880px,100svh)] lg:pt-24 lg:pb-16">
          <div className="flex flex-col items-start lg:max-w-[min(30rem,38vw)]">
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
              <PrimaryLink href="/docs/components">
                Browse components
              </PrimaryLink>
              <SecondaryLink href="/docs/installation">
                Read the docs
              </SecondaryLink>
            </div>
          </div>
        </Container>

        {/* Beside the text from lg up, below the header; under the text on phones. */}
        <HeroCanvasLoader className="h-[62svh] min-h-[440px] w-full lg:absolute lg:top-16 lg:right-0 lg:bottom-0 lg:h-auto lg:min-h-0 lg:w-[58%]" />
      </div>

      <StackTicker />
    </section>
  );
}
