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

const pipeline: { label: string; state: "done" | "active" | "idle" }[] = [
  { label: "Ingest and validate data", state: "done" },
  { label: "Route work automatically", state: "done" },
  { label: "Score and prioritize", state: "active" },
  { label: "Trigger the next action", state: "idle" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
      {/* Warm radial glow echoing the template artwork. */}
      <div
        aria-hidden
        className="-z-10 -translate-x-1/2 pointer-events-none absolute top-16 left-1/2 h-[460px] w-[900px] max-w-none rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--syntiq-accent)_22%,transparent),transparent)] blur-3xl"
      />

      <Container className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-medium font-mono text-muted-foreground text-xs uppercase tracking-[0.18em]">
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          Structured AI
        </span>

        <h1 className="mt-7 max-w-4xl text-balance font-semibold text-5xl leading-[1.02] tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-[5rem]">
          AI systems built on structure, not hype
        </h1>

        <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          We design structured AI systems for teams that value clarity, logic,
          and scale. Real infrastructure, not scattered experiments.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            className={cn(
              linkButtonBaseClassName,
              accentButtonClassName,
              "w-full sm:w-auto",
            )}
            href="#services"
          >
            See how it works
            <ArrowIcon className="size-4" />
          </Link>
          <Link
            className={cn(
              linkButtonBaseClassName,
              secondaryButtonClassName,
              "w-full sm:w-auto",
            )}
            href="#contact"
          >
            Talk to us
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-3 text-muted-foreground text-sm">
          <span className="font-semibold text-2xl text-foreground tracking-tight">
            200+
          </span>
          Teams building with structure
        </div>

        {/* Product-mockup panel echoing the template's systems dashboard art. */}
        <div className="mt-16 w-full max-w-4xl">
          <div className="overflow-hidden rounded-[24px] border border-border bg-card p-3 shadow-2xl">
            <div className="rounded-[16px] border border-border bg-background/60 p-5 text-left sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="size-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-muted-foreground text-xs">
                    workflow pipeline
                  </span>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary uppercase tracking-widest">
                  Live
                </span>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr]">
                <ul className="flex flex-col gap-3">
                  {pipeline.map((step) => (
                    <li
                      className="flex items-center gap-3 rounded-[12px] border border-border bg-card/60 px-4 py-3"
                      key={step.label}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px]",
                          step.state === "done" &&
                            "border-primary/40 bg-primary/15 text-primary",
                          step.state === "active" &&
                            "border-primary bg-primary text-primary-foreground",
                          step.state === "idle" &&
                            "border-border text-muted-foreground",
                        )}
                      >
                        {step.state === "done" ? "✓" : "•"}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          step.state === "idle"
                            ? "text-muted-foreground"
                            : "text-foreground",
                        )}
                      >
                        {step.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col justify-between gap-4 rounded-[12px] border border-border bg-card/60 p-4">
                  <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
                    Operational efficiency
                  </span>
                  <span className="font-semibold text-4xl text-foreground tracking-tight">
                    +40%
                  </span>
                  <div className="flex items-end gap-1.5" aria-hidden>
                    {[35, 52, 44, 68, 60, 82, 76].map((height, index) => (
                      <span
                        className={cn(
                          "w-full rounded-t-[3px]",
                          index >= 5 ? "bg-primary" : "bg-white/15",
                        )}
                        // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
                        key={index}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
