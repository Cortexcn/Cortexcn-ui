"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import {
  COMPONENT_PLANS,
  cadenceLabel,
  formatUsd,
  PROJECT_PACKAGES,
  type PricedPackage,
  RETAINERS,
} from "@/lib/service-pricing";
import { cn } from "@/lib/utils";

import {
  ActionLink,
  ArrowRightIcon,
  PixelArt,
  SectionLabel,
  TypeHeading,
  useScrambleText,
} from "./kit";
import { Container } from "./primitives";

/* 7x7 pixel icons for the toggle: blocks, a browser window, and a calendar. */
const COMPONENTS_ICON = [
  "###.###",
  "###.###",
  "###.###",
  ".......",
  "###.###",
  "###.###",
  "###.###",
];

const PROJECTS_ICON = [
  "#######",
  "#######",
  "#.....#",
  "#.....#",
  "#.....#",
  "#.....#",
  "#######",
];

const RETAINERS_ICON = [
  ".#...#.",
  "#######",
  "#######",
  "#.....#",
  "#.#.#.#",
  "#.....#",
  "#######",
];

const KINDS = [
  {
    value: "projects",
    label: "Projects",
    icon: PROJECTS_ICON,
    plans: PROJECT_PACKAGES,
    note: "Starting prices in US dollars. Every project gets a written quote before work starts.",
  },
  {
    value: "retainers",
    label: "Retainers",
    icon: RETAINERS_ICON,
    plans: RETAINERS,
    note: "Billed monthly in US dollars. Pause or cancel with 2 weeks notice.",
  },
  {
    value: "components",
    label: "Components",
    icon: COMPONENTS_ICON,
    plans: COMPONENT_PLANS,
    note: "One-time payments in US dollars. No subscriptions and no renewals.",
  },
] as const;

type Kind = (typeof KINDS)[number]["value"];

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

function priceLabel(plan: PricedPackage) {
  if (plan.cadence !== "once") {
    return "Starting at";
  }
  return plan.price === 0 ? "Free forever" : "One-time payment";
}

function spokenPrice(plan: PricedPackage, text: string) {
  if (plan.price === 0) {
    return "Free";
  }
  if (plan.cadence === "once") {
    return `${text}, paid once`;
  }
  return `${text} ${plan.cadence === "month" ? "per month" : "per project"}`;
}

/** "$1,500 /project": the price, re-typed when it changes. */
function Price({ plan }: { plan: PricedPackage }) {
  const text = formatUsd(plan.price);
  const [display, play] = useScrambleText(text, 45);
  const suffix = cadenceLabel(plan.cadence);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
        {priceLabel(plan)}
      </span>
      {/* Five-figure prices wrap the suffix on narrow phones instead of overflowing. */}
      <p className="flex flex-wrap items-baseline gap-x-1">
        <span className="sr-only">{spokenPrice(plan, text)}</span>
        <span
          aria-hidden="true"
          className="whitespace-pre text-[4rem] leading-[1.1] tracking-[-0.06em] lg:text-[3.5rem] xl:text-[4rem]"
        >
          {display}
        </span>
        {suffix ? (
          <span
            aria-hidden="true"
            className="text-lg text-muted-foreground leading-[1.3] tracking-[-0.05em]"
          >
            {suffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function PlanCard({ plan }: { plan: PricedPackage }) {
  const highlighted = Boolean(plan.badge);
  return (
    <article
      className={cn(
        "relative flex flex-col bg-background",
        highlighted
          ? "z-1 border border-primary outline-8 outline-muted"
          : "border border-border",
      )}
    >
      {highlighted ? (
        <>
          <span className="absolute -top-px -left-px size-1.5 bg-primary" />
          <span className="absolute -top-px -right-px size-1.5 bg-primary" />
          <span className="absolute -bottom-px -left-px size-1.5 bg-primary" />
          <span className="absolute -right-px -bottom-px size-1.5 bg-primary" />
        </>
      ) : null}

      <div className="flex flex-col border-border border-b px-6 pt-8 pb-8">
        <div className="flex h-4.5 items-center gap-2">
          {plan.badge ? (
            <span className="bg-muted px-0.5 font-medium font-mono text-body text-xs uppercase leading-[1.3] tracking-[-0.04em]">
              {plan.badge}
            </span>
          ) : null}
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
          <span className="font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
            {plan.tag}
          </span>
        </div>

        <div className="mt-7.5 flex items-center gap-2">
          {highlighted ? (
            <PixelArt className="h-8 w-7 text-primary" rows={BOLT_ROWS} />
          ) : null}
          <h3 className="font-medium text-[2rem] leading-[1.2] tracking-[-0.05em]">
            {plan.name}
          </h3>
        </div>
        <p className="mt-1.5 min-h-12 text-body text-lg leading-[1.3] tracking-[-0.05em]">
          {plan.summary}
        </p>

        <div className="mt-10">
          <Price plan={plan} />
        </div>

        <ActionLink
          block
          className="mt-10"
          href={plan.action.href}
          label={plan.action.label}
        />
      </div>

      <div className="flex flex-col gap-4 px-6 pt-8 pb-10">
        <p className="font-medium text-base leading-[1.3] tracking-[-0.05em]">
          {plan.cadence === "month" ? "Every month:" : "What you get:"}
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
                  highlighted ? "text-primary" : "text-muted-foreground",
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

function KindToggle({
  kind,
  onChange,
}: {
  kind: Kind;
  onChange: (kind: Kind) => void;
}) {
  return (
    <fieldset className="flex w-full sm:w-auto">
      <legend className="sr-only">Show prices for</legend>
      {KINDS.map((option) => {
        const selected = kind === option.value;
        return (
          <button
            aria-pressed={selected}
            className={cn(
              "group -ml-px flex h-12 flex-1 items-center justify-center gap-2 border bg-background px-3 text-sm leading-[1.3] tracking-[-0.05em] outline-none transition-colors first-of-type:ml-0 focus-visible:ring-2 focus-visible:ring-ring/50 sm:flex-none sm:px-4 sm:text-base",
              selected
                ? "z-1 border-primary font-medium text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <PixelArt
              className="size-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110"
              rows={option.icon}
            />
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}

/**
 * The plan cards with the projects, retainers, and components toggle. Used by
 * the landing pricing section and the /pricing page. Client work comes first.
 */
export function PricingPlans({ heading }: { heading?: string[] }) {
  const [kind, setKind] = useState<Kind>("projects");
  const active = KINDS.find((option) => option.value === kind) ?? KINDS[0];

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        {heading ? <TypeHeading lines={heading} /> : null}
        <KindToggle kind={kind} onChange={setKind} />
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-0">
          {active.plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
        <p className="font-medium font-mono text-muted-foreground text-xs uppercase leading-[1.3] tracking-[-0.04em]">
          {active.note}
        </p>
      </div>
    </div>
  );
}

function PricingLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="group inline-flex items-center gap-2 font-medium font-mono text-sm uppercase leading-[1.3] tracking-[-0.04em] transition-colors hover:text-primary"
      href={href}
    >
      {children}
      <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

export function PricingSection() {
  return (
    <section aria-label="Pricing" className="w-full py-20" id="pricing">
      <Container className="flex flex-col gap-6">
        <SectionLabel label="Pricing" section="pricing" />
        <PricingPlans heading={["Clear prices.", "Hire me by the project."]} />
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <PricingLink href="/pricing#estimate">
            Estimate your project
          </PricingLink>
          <PricingLink href="/pricing#every-service">
            See every service
          </PricingLink>
        </div>
      </Container>
    </section>
  );
}
