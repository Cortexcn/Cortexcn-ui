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

/** Service 1 visual: an automation run completing step by step. */
function AutomationVisual() {
  const steps = [
    "Lead ingested",
    "Contact data validated",
    "CRM record synced",
    "Lead scored and qualified",
    "Follow-up sequence triggered",
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-2.5 p-6">
      {steps.map((step, index) => (
        <div
          className="flex items-center gap-3 rounded-[10px] border border-border bg-background/40 px-4 py-2.5"
          key={step}
        >
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]",
              index === steps.length - 1
                ? "border border-border text-muted-foreground"
                : "bg-primary/15 text-primary",
            )}
          >
            {index === steps.length - 1 ? "•" : "✓"}
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Service 2 visual: a small agent workflow diagram with build states. */
function AgentVisual() {
  const nodes = ["Create task", "Notify team", "Export CSV"];
  const states: { label: string; active?: boolean }[] = [
    { label: "Plan" },
    { label: "Building", active: true },
    { label: "Testing" },
    { label: "Live" },
  ];

  return (
    <div className="flex h-full flex-col justify-center gap-5 p-6">
      <div className="flex items-center justify-between gap-2">
        {nodes.map((node, index) => (
          <div className="flex flex-1 items-center gap-2" key={node}>
            <div className="flex-1 rounded-[10px] border border-border bg-background/40 px-3 py-2.5 text-center">
              <span className="font-mono text-[11px] text-foreground">
                {node}
              </span>
            </div>
            {index < nodes.length - 1 ? (
              <span aria-hidden className="text-muted-foreground">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {states.map((state) => (
          <span
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest",
              state.active
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground",
            )}
            key={state.label}
          >
            {state.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Service 3 visual: a decision-support chart trending up. */
function DecisionVisual() {
  const bars = [30, 42, 38, 55, 62, 78, 88];

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Forecast accuracy
        </span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
          +38%
        </span>
      </div>
      <div className="flex flex-1 items-end gap-2" aria-hidden>
        {bars.map((height, index) => (
          <span
            className={cn(
              "w-full rounded-t-[4px]",
              index >= bars.length - 2 ? "bg-primary" : "bg-white/12",
            )}
            // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars
            key={index}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        {["0%", "20%", "40%", "60%", "100%"].map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
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
    label: "Automation",
    heading: "AI workflow automation",
    body: "We build systems that run your operational workflows end to end, without manual handoffs.",
    bullets: [
      "Ingest, validate, and route data",
      "Trigger the next action automatically",
      "Full audit trail on every run",
    ],
    visual: <AutomationVisual />,
  },
  {
    label: "Agents",
    heading: "Custom AI agents and assistants",
    body: "Purpose-built AI systems wired directly into your workflows, tools, and team operations.",
    bullets: [
      "Built for your stack, not a generic bot",
      "Human-in-the-loop where it matters",
      "Tested before it goes live",
    ],
    visual: <AgentVisual />,
  },
  {
    label: "Decisions",
    heading: "AI decision support",
    body: "Turn scattered data into decisions you can act on, with predictive analytics and clear signals.",
    bullets: [
      "Real-time metrics and monitoring",
      "Predictive models on your data",
      "Insights, not another dashboard to babysit",
    ],
    visual: <DecisionVisual />,
  },
];

export function FeaturesSection() {
  return (
    <Section id="services">
      <Container>
        <SectionHeading
          description="Structured AI systems that automate execution, sharpen decisions, and unify data across your operations."
          eyebrow="Services"
          title="AI infrastructure for operational performance"
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
                  <p className="font-mono text-primary text-xs uppercase tracking-widest">
                    {feature.label}
                  </p>
                  <h3 className="mt-3 font-semibold text-2xl tracking-tight md:text-3xl">
                    {feature.heading}
                  </h3>
                  <p className="mt-4 text-muted-foreground">{feature.body}</p>
                  <ul className="mt-6 space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li className="flex items-start gap-2.5" key={bullet}>
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
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
