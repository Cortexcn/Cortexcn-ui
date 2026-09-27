"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
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

type Kind = "projects" | "retainers";

const PACKAGES: Record<Kind, PricedPackage[]> = {
  projects: PROJECT_PACKAGES,
  retainers: RETAINERS,
};

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

/** "$1,500 /project": the starting price, re-typed when it changes. */
function Price({ plan }: { plan: PricedPackage }) {
  const text = formatUsd(plan.price);
  const [display, play] = useScrambleText(text, 45);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
        Starting at
      </span>
      <p className="flex items-baseline gap-1">
        <span className="sr-only">
          {text} {plan.cadence === "month" ? "per month" : "per project"}
        </span>
        <span
          aria-hidden="true"
          className="whitespace-pre text-[4rem] leading-[1.1] tracking-[-0.06em]"
        >
          {display}
        </span>
        <span
          aria-hidden="true"
          className="text-lg text-muted-foreground leading-[1.3] tracking-[-0.05em]"
        >
          {cadenceLabel(plan.cadence)}
        </span>
      </p>
    </div>
  );
}

function PlanCard({ plan }: { plan: PricedPackage }) {
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
          <span className="font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
            {plan.timeline}
          </span>
        </div>

        <div className="mt-7.5 flex items-center gap-2">
          {plan.featured ? (
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
          href="/contact"
          label="Get a quote"
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

function KindToggle({
  kind,
  onChange,
}: {
  kind: Kind;
  onChange: (kind: Kind) => void;
}) {
  const option = (value: Kind, label: string) => {
    const selected = kind === value;
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
      </button>
    );
  };

  return (
    <fieldset className="flex">
      <legend className="sr-only">Kind of work</legend>
      {option("projects", "Projects")}
      {option("retainers", "Monthly retainers")}
    </fieldset>
  );
}

/**
 * The package cards with the projects and retainers toggle. Used by the
 * landing pricing section and the /pricing page.
 */
export function PricingPlans({ heading }: { heading?: string[] }) {
  const [kind, setKind] = useState<Kind>("projects");

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        {heading ? <TypeHeading lines={heading} /> : null}
        <KindToggle kind={kind} onChange={setKind} />
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-0">
          {PACKAGES[kind].map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
        <p className="font-medium font-mono text-muted-foreground text-xs uppercase leading-[1.3] tracking-[-0.04em]">
          Starting prices in US dollars. Every project gets a written quote
          before work starts.
        </p>
      </div>
    </div>
  );
}

export function PricingSection() {
  return (
    <section aria-label="Pricing" className="w-full py-20" id="pricing">
      <Container className="flex flex-col gap-6">
        <SectionLabel label="Pricing" section="pricing" />
        <PricingPlans heading={["Clear prices.", "Quoted before we start."]} />
        <Link
          className="group inline-flex items-center gap-2 self-start font-medium font-mono text-sm uppercase leading-[1.3] tracking-[-0.04em] transition-colors hover:text-primary"
          href="/pricing"
        >
          See every service and add-on
          <ArrowRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Container>
    </section>
  );
}
