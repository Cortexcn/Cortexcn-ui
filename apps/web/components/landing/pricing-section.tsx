"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  ActionLink,
  PixelArt,
  SectionLabel,
  TypeHeading,
  useScrambleText,
} from "./kit";
import { Container } from "./primitives";

type Billing = "monthly" | "annually";

interface Plan {
  name: string;
  description: string;
  /** USD per month when billed monthly. */
  monthly: number;
  includes: string;
  features: string[];
  featured?: boolean;
}

/*
 * Plan names, prices, and features are a preview for launch; the paid plans
 * are not live yet, which the note under the cards says.
 */
const PLANS: Plan[] = [
  {
    name: "Free",
    description: "For side projects and trying Cortexcn",
    monthly: 0,
    includes: "Includes:",
    features: [
      "Every component in the registry",
      "Charts, blocks, and UI",
      "Install with the shadcn CLI",
      "Community support",
    ],
  },
  {
    name: "Pro",
    description: "For freelancers and small teams",
    monthly: 19,
    includes: "Includes everything in Free, plus:",
    features: [
      "Premium blocks and page templates",
      "Guided MCP setup for your agent",
      "Early access to new components",
      "Email support",
    ],
    featured: true,
  },
  {
    name: "Team",
    description: "For teams shipping client work",
    monthly: 49,
    includes: "Includes everything in Free & Pro, plus:",
    features: [
      "Seats for your whole team",
      "A private registry for your components",
      "Priority component requests",
      "Priority support",
    ],
  },
];

const ANNUAL_DISCOUNT = 0.2;

const BOLT_ROWS = [
  ".....####",
  "....####.",
  "...####..",
  "..####...",
  ".########",
  "......##.",
  ".....##..",
  "....##...",
  "...##....",
  "..##.....",
];

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.25"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.5 8.5l3.5 3.5 7.5-8" />
    </svg>
  );
}

/** "$19.00": dollars in the text color, cents lighter; re-types on change. */
function Price({ amount }: { amount: number }) {
  const text = amount.toFixed(2);
  const [display, play] = useScrambleText(text, 45);

  useEffect(() => {
    play();
  }, [play]);

  const [dollars = "", cents = ""] = display.split(".");
  return (
    <p className="flex items-baseline gap-1">
      <span className="sr-only">${text} per month</span>
      <span
        aria-hidden="true"
        className="whitespace-pre text-[4rem] leading-[1.1] tracking-[-0.06em]"
      >
        ${dollars}.<span className="text-label-weak">{cents}</span>
      </span>
      <span
        aria-hidden="true"
        className="text-lg text-muted-foreground leading-[1.3] tracking-[-0.05em]"
      >
        /month
      </span>
    </p>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const amount =
    billing === "annually"
      ? plan.monthly * (1 - ANNUAL_DISCOUNT)
      : plan.monthly;

  return (
    <article
      className={cn(
        "relative flex flex-col bg-background",
        plan.featured
          ? "z-1 border border-primary outline-8 outline-muted"
          : "border border-border",
      )}
    >
      {plan.featured ? (
        <>
          <span className="absolute -top-px -left-px size-1.5 bg-primary" />
          <span className="absolute -top-px -right-px size-1.5 bg-primary" />
          <span className="absolute -bottom-px -left-px size-1.5 bg-primary" />
          <span className="absolute -right-px -bottom-px size-1.5 bg-primary" />
        </>
      ) : null}

      <div className="flex flex-col border-border border-b px-6 pt-8 pb-8">
        <div className="flex h-4.5 items-center gap-2">
          {plan.featured ? (
            <span className="bg-muted px-0.5 font-medium font-mono text-body text-xs uppercase leading-[1.3] tracking-[-0.04em]">
              Most popular
            </span>
          ) : null}
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-7.5 flex items-center gap-2">
          {plan.featured ? (
            <PixelArt className="h-8 w-7 text-primary" rows={BOLT_ROWS} />
          ) : null}
          <h3 className="font-medium text-[2rem] leading-[1.2] tracking-[-0.05em]">
            {plan.name}
          </h3>
        </div>
        <p className="mt-1.5 text-body text-lg leading-[1.3] tracking-[-0.05em]">
          {plan.description}
        </p>

        <div className="mt-13">
          <Price amount={amount} />
        </div>

        <ActionLink
          block
          className="mt-12"
          href="/docs/installation"
          label={plan.monthly === 0 ? "Start free" : "Get started"}
        />
      </div>

      <div className="flex flex-col gap-4 px-6 pt-8 pb-10">
        <p className="font-medium text-base leading-[1.3] tracking-[-0.05em]">
          {plan.includes}
        </p>
        <ul className="flex flex-col gap-2">
          {plan.features.map((feature) => (
            <li
              className="flex items-center gap-3 text-base text-body leading-[1.3] tracking-[-0.05em]"
              key={feature}
            >
              <CheckIcon
                className={cn(
                  "size-4 shrink-0",
                  plan.featured ? "text-primary" : "text-muted-foreground",
                )}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (billing: Billing) => void;
}) {
  const option = (value: Billing, label: string) => {
    const selected = billing === value;
    return (
      <button
        aria-pressed={selected}
        className={cn(
          "-ml-px flex h-12 items-center gap-2 border bg-background px-4 text-base leading-[1.3] tracking-[-0.05em] outline-none transition-colors first:ml-0 focus-visible:ring-2 focus-visible:ring-ring/50",
          selected
            ? "z-1 border-primary font-medium text-primary"
            : "border-border text-muted-foreground hover:text-foreground",
        )}
        onClick={() => onChange(value)}
        type="button"
      >
        <span
          aria-hidden="true"
          className={cn(
            "size-2 bg-primary transition-[width,opacity] duration-300",
            selected ? "w-2 opacity-100" : "-mr-2 w-0 opacity-0",
          )}
        />
        {label}
        {value === "annually" ? (
          <span className="bg-primary px-0.5 font-medium font-mono text-primary-foreground text-xs uppercase leading-[1.3] tracking-[-0.04em]">
            Save 20%
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <fieldset className="flex">
      <legend className="sr-only">Billing period</legend>
      {option("monthly", "Monthly")}
      {option("annually", "Annually")}
    </fieldset>
  );
}

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section aria-label="Pricing" className="w-full py-20" id="pricing">
      <Container className="flex flex-col gap-6">
        <SectionLabel label="Pricing" section="pricing" />
        <div className="flex flex-col gap-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <TypeHeading lines={["Simple pricing.", "Free to start."]} />
            <BillingToggle billing={billing} onChange={setBilling} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-0">
              {PLANS.map((plan) => (
                <PlanCard billing={billing} key={plan.name} plan={plan} />
              ))}
            </div>
            <p className="font-medium font-mono text-muted-foreground text-xs uppercase leading-[1.3] tracking-[-0.04em]">
              Pricing preview. Paid plans are not live yet.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
