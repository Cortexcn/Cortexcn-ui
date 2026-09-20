import type * as React from "react";

import { cn } from "@/lib/utils";

import { Container, Section, SectionHeading, Surface } from "./primitives";

function CheckIcon({ className }: { className?: string }) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Feature 1 visual: a small grid of component tiles, one active. */
function ComponentLibraryVisual() {
  const tiles = [
    { name: "Button", active: true },
    { name: "Card", active: false },
    { name: "Input", active: false },
    { name: "Badge", active: false },
    { name: "Avatar", active: false },
    { name: "Toggle", active: false },
  ];

  return (
    <div className="grid h-full grid-cols-3 gap-3 p-6">
      {tiles.map((tile) => (
        <div
          className={cn(
            "flex flex-col justify-between rounded-[8px] border p-3",
            tile.active
              ? "border-foreground/50 bg-foreground/10"
              : "border-border bg-background/40",
          )}
          key={tile.name}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              tile.active ? "bg-foreground" : "bg-muted-foreground/40",
            )}
          />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
            {tile.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Feature 2 visual: a terminal mock matching the hero's terminal styling. */
function McpVisual() {
  const lines: { prompt: string; text: string; accent?: boolean }[] = [
    { prompt: "$", text: "npx cortexcn mcp add" },
    { prompt: "", text: "Connected to your agent", accent: true },
    { prompt: ">", text: "Browsing the component library" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-border/70 border-b px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-yellow-400/80" />
        <span className="size-2.5 rounded-full bg-green-400/80" />
        <span className="ml-2 font-mono text-muted-foreground text-xs">
          mcp
        </span>
      </div>
      <div className="space-y-2 p-5 font-mono text-sm">
        {lines.map((line) => (
          <div className="flex gap-2" key={line.text}>
            <span
              className={cn(
                "select-none",
                line.accent
                  ? "text-foreground dark:text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {line.accent ? "✓" : line.prompt}
            </span>
            <span
              className={cn(
                line.accent ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Feature 3 visual: a short chat prompt that turns into an assembled page. */
function AssemblyVisual() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div className="max-w-[85%] self-start rounded-[10px] border border-border bg-background/40 px-4 py-2.5">
        <p className="font-mono text-muted-foreground text-xs">
          Build a pricing page with three tiers
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-3 rounded-[10px] border border-foreground/30 bg-foreground/5 p-3">
        <div className="h-2 w-16 rounded-full bg-foreground/60" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-14 rounded-[6px] border border-border bg-background/60" />
          <div className="h-14 rounded-[6px] border border-foreground/50 bg-foreground/10" />
          <div className="h-14 rounded-[6px] border border-border bg-background/60" />
        </div>
        <div className="mt-auto h-2 w-24 rounded-full bg-muted-foreground/30" />
      </div>
    </div>
  );
}

type Feature = {
  label: string;
  heading: string;
  body: string;
  bullets: string[];
  visual: React.ReactNode;
};

const features: Feature[] = [
  {
    label: "Component library",
    heading: "A real component library",
    body: "Curated, production components with the states and edge cases already handled. Your agent pulls them instead of reinventing them.",
    bullets: [
      "Accessible by default",
      "Light and dark themes built in",
      "Copy and paste, code you own",
    ],
    visual: <ComponentLibraryVisual />,
  },
  {
    label: "MCP",
    heading: "Connected over MCP",
    body: "One command connects Cortexcn to your agent. It browses the library and pulls what it needs on its own.",
    bullets: [
      "One line to set up",
      "Works with Claude, Cursor, and Codex",
      "No API keys to wire by hand",
    ],
    visual: <McpVisual />,
  },
  {
    label: "Assembly",
    heading: "From prompt to page",
    body: "Describe the page in plain words. Your agent assembles it from real components and wires the data.",
    bullets: [
      "Full sections, not snippets",
      "Edit the code you get",
      "Ship the same day",
    ],
    visual: <AssemblyVisual />,
  },
];

export function FeaturesSection() {
  return (
    <Section id="features">
      <Container>
        <SectionHeading
          align="center"
          description="Cortexcn gives your agent components it can trust, so the page is right the first time."
          eyebrow="How it helps"
          title="Your agent builds from a real library"
        />

        <div className="mt-16 space-y-16 md:mt-20 md:space-y-24">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;

            return (
              <div
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
                key={feature.heading}
              >
                <div className={cn(isReversed && "md:order-2")}>
                  <p className="font-mono text-foreground text-xs uppercase tracking-widest dark:text-foreground">
                    {feature.label}
                  </p>
                  <h3 className="mt-3 font-semibold text-2xl tracking-tight md:text-3xl">
                    {feature.heading}
                  </h3>
                  <p className="mt-4 text-muted-foreground">{feature.body}</p>
                  <ul className="mt-6 space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li className="flex items-start gap-2.5" key={bullet}>
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-foreground dark:text-foreground" />
                        <span className="text-muted-foreground text-sm">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Surface
                  className={cn(
                    "aspect-[4/3] min-h-[280px] overflow-hidden",
                    isReversed && "md:order-1",
                  )}
                >
                  {feature.visual}
                </Surface>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
