import Link from "next/link";
import { BLOCK_CATEGORIES } from "@/blocks/categories";
import { CopyButton } from "@/components/copy-button";
import { COMPONENT_GROUPS } from "@/lib/component-families";
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

const MCP_DOCS = "/docs/integration/mcp";

/** The one-line setup from the MCP docs, for Claude Code. */
const MCP_COMMAND =
  "claude mcp add --transport http cortexcn https://ui.cortexcn.dev/mcp";

const ANNOUNCEMENT = {
  tag: "New",
  text: "Connect your AI agent with the Cortexcn MCP server",
  href: MCP_DOCS,
};

const HEADLINE = [
  { text: "Charts, blocks, and motion," },
  { text: "one prompt away.", muted: true },
];

/** Counted from the docs and the block categories, so the copy stays true. */
const COMPONENT_COUNT = COMPONENT_GROUPS.reduce(
  (count, group) => count + group.slugs.length,
  0,
);
const CHART_COUNT =
  COMPONENT_GROUPS.find((group) => group.category === "charts")?.slugs.length ??
  0;
const BLOCK_COUNT = BLOCK_CATEGORIES.reduce(
  (count, category) => count + category.blocks.length,
  0,
);

/** CSS-only entrance, so the copy animates in before hydration finishes. */
const enterClassName =
  "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700 ease-out motion-reduce:animate-none";

export function HeroSection() {
  return (
    <section className="pb-16 md:pb-20" id="hero">
      <div className="relative overflow-hidden">
        <Container className="relative z-10 flex items-center pt-28 pb-10 md:pt-36 lg:min-h-[min(880px,100svh)] lg:pt-24 lg:pb-16">
          <div className="flex w-full min-w-0 flex-col items-start lg:max-w-[min(30rem,38vw)]">
            <Link
              className={cn(
                "group mb-7 inline-flex max-w-full items-center gap-2.5 text-body text-sm sm:text-base",
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
              {COMPONENT_COUNT} components, {CHART_COUNT} of them charts, and{" "}
              {BLOCK_COUNT} page blocks for shadcn/ui. Connect the Cortexcn MCP
              server once, then ask Claude, Cursor, or VS Code to add any of
              them. The code lands in your repo, ready to change.
            </p>

            <div
              className={cn(
                "mt-9 flex flex-wrap items-center gap-3 delay-500",
                enterClassName,
              )}
            >
              <PrimaryLink href={MCP_DOCS}>Install the MCP server</PrimaryLink>
              <SecondaryLink href="/docs/components">
                Browse components
              </SecondaryLink>
            </div>

            {/* The setup command itself, for readers already in Claude Code. */}
            <div
              className={cn(
                "mt-5 flex w-full max-w-[30rem] items-center gap-2 rounded-xl border border-border bg-muted/50 py-1 pr-1 pl-3 delay-700",
                enterClassName,
              )}
            >
              <span
                aria-hidden="true"
                className="font-mono text-muted-foreground text-xs"
              >
                $
              </span>
              <code className="min-w-0 flex-1 truncate font-mono text-foreground/80 text-xs">
                {MCP_COMMAND}
              </code>
              <CopyButton
                aria-label="Copy the MCP setup command"
                text={MCP_COMMAND}
              />
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
