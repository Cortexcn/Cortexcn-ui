import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  accentButtonClassName,
  Container,
  linkButtonBaseClassName,
  secondaryButtonClassName,
} from "./primitives";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

const terminalLines: { prompt: string; text: string; done?: boolean }[] = [
  { prompt: "$", text: "npx cortexcn mcp add" },
  { prompt: "", text: "Connected to Claude, Cursor, and Codex", done: true },
  { prompt: ">", text: "Build a pricing page with three tiers" },
  { prompt: "", text: "Assembled from 7 components", done: true },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Soft violet wash echoing the template artwork. */}
      <div
        aria-hidden
        className="-z-10 -translate-x-1/2 pointer-events-none absolute top-24 left-1/2 h-[420px] w-[900px] max-w-none rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--color-violet-500)_16%,transparent),transparent)] blur-2xl"
      />

      <Container className="flex flex-col items-center text-center">
        {/* Announcement chip (AgentLab-style top bar, folded into the hero). */}
        <Link
          className="group inline-flex items-center gap-2 rounded-full bg-foreground py-1.5 pr-3 pl-1.5 font-medium text-background text-xs"
          href="/docs"
        >
          <span className="rounded-full bg-background/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
            New
          </span>
          The Cortexcn MCP server for Claude, Cursor, and Codex
          <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <p className="mt-10 flex items-center gap-2 font-medium font-mono text-muted-foreground text-xs uppercase tracking-[0.2em]">
          <span aria-hidden className="size-1.5 rounded-full bg-foreground" />
          Built for developers, freelancers, and startups
        </p>

        <h1 className="mt-6 max-w-4xl text-balance font-display font-normal text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          Turn a prompt into a production website
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          Cortexcn connects your AI coding agent to a real component library
          over MCP. Pick a component, describe the page, and your agent ships
          it.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            className={cn(
              linkButtonBaseClassName,
              secondaryButtonClassName,
              "w-full sm:w-auto",
            )}
            href="/docs/components"
          >
            Browse components
          </Link>
          <Link
            className={cn(
              linkButtonBaseClassName,
              accentButtonClassName,
              "w-full sm:w-auto",
            )}
            href="/docs"
          >
            Get started
            <ArrowIcon className="size-4" />
          </Link>
        </div>

        {/* Two product-mockup panels echoing the template's paired hero art. */}
        <div className="mt-16 grid w-full max-w-5xl gap-4 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-[16px] border border-border bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-transparent p-5 text-left shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="ml-1 font-mono text-muted-foreground text-xs">
                cortexcn
              </span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              {terminalLines.map((line) => (
                <div className="flex gap-2" key={line.text}>
                  <span className="select-none text-muted-foreground">
                    {line.done ? "✓" : line.prompt}
                  </span>
                  <span
                    className={
                      line.done ? "text-foreground" : "text-muted-foreground"
                    }
                  >
                    {line.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[16px] border border-border bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-transparent p-5 text-left shadow-sm">
            <div className="grid h-full grid-cols-2 gap-3">
              {["Hero", "Pricing", "Features", "FAQ"].map((label) => (
                <div
                  className="flex flex-col justify-between rounded-[10px] border border-border/70 bg-card/70 p-3"
                  key={label}
                >
                  <div className="h-1.5 w-8 rounded-full bg-foreground/25" />
                  <span className="mt-6 font-medium text-foreground text-xs">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
