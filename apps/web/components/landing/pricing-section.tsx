"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  accentButtonClassName,
  Container,
  linkButtonBaseClassName,
  primaryButtonClassName,
  Section,
  SectionHeading,
  Surface,
} from "./primitives";

type Plan = {
  name: string;
  blurb: string;
  monthly: number;
  features: string[];
  popular?: boolean;
};

// Illustrative pricing for the template layout. Set your own before launch.
const plans: Plan[] = [
  {
    name: "Starter",
    blurb: "For teams starting with automation",
    monthly: 400,
    features: [
      "Workflow audit and opportunity map",
      "1-2 AI automation systems",
      "Integration with your current tools",
      "Basic analytics and reporting",
      "4-6 week implementation",
    ],
  },
  {
    name: "Growth",
    blurb: "For scaling product and ops teams",
    monthly: 1200,
    popular: true,
    features: [
      "Full operational AI strategy",
      "Multiple automated workflows",
      "Decision-support dashboards",
      "Custom AI assistants",
      "8-12 week implementation",
    ],
  },
  {
    name: "Enterprise",
    blurb: "For complex organizations",
    monthly: 2500,
    features: [
      "Company-wide system architecture",
      "Advanced automation and orchestration",
      "Predictive analytics models",
      "Dedicated system design",
      "Long-term partnership model",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="mt-0.5 size-4 shrink-0 text-primary"
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

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <Section id="pricing">
      <Container className="flex flex-col items-center">
        <SectionHeading
          description="Choose the AI implementation level that fits your needs, from focused automation to full-scale infrastructure."
          eyebrow="Pricing"
          title="Flexible engagement, structured value"
        />

        <div className="mt-8 inline-flex items-center gap-1 border border-border bg-card p-1">
          <button
            className={cn(
              "px-4 py-1.5 font-medium text-sm transition-colors",
              annual
                ? "text-muted-foreground hover:text-foreground"
                : "bg-foreground text-background",
            )}
            onClick={() => setAnnual(false)}
            type="button"
          >
            Monthly
          </button>
          <button
            className={cn(
              "px-4 py-1.5 font-medium text-sm transition-colors",
              annual
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setAnnual(true)}
            type="button"
          >
            Annual
            <span className="ml-1.5 text-primary text-xs">-20%</span>
          </button>
        </div>

        <div className="mt-12 grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = annual
              ? Math.round(plan.monthly * 0.8)
              : plan.monthly;

            return (
              <Surface
                className={cn(
                  "flex flex-col gap-6 p-8",
                  plan.popular && "border-primary/50 ring-1 ring-primary/30",
                )}
                key={plan.name}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground text-lg">
                      {plan.name}
                    </h3>
                    {plan.popular ? (
                      <span className="border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary uppercase tracking-widest">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.blurb}</p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="font-semibold text-5xl text-foreground tracking-tight">
                    ${price.toLocaleString()}
                  </span>
                  <span className="mb-1.5 text-muted-foreground text-sm">
                    /month
                  </span>
                </div>

                <Link
                  className={cn(
                    linkButtonBaseClassName,
                    plan.popular
                      ? primaryButtonClassName
                      : accentButtonClassName,
                    "w-full",
                  )}
                  href="#contact"
                >
                  Get in touch
                </Link>

                <ul className="flex flex-col gap-3 border-border/70 border-t pt-6">
                  {plan.features.map((feature) => (
                    <li className="flex items-start gap-2.5" key={feature}>
                      <CheckIcon />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </Surface>
            );
          })}
        </div>

        <p className="mt-6 text-muted-foreground text-xs">
          Illustrative pricing. Replace with your own before launch.
        </p>
      </Container>
    </Section>
  );
}
