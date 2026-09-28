import Link from "next/link";

import {
  COMPONENT_PLANS,
  formatUsd,
  PLAN_REFUND_DAYS,
  type PricedPackage,
} from "@/lib/service-pricing";
import { cn } from "@/lib/utils";

import { Painting } from "./painting";
import { Container, PrimaryLink, SecondaryLink } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function PlanCard({ plan }: { plan: PricedPackage }) {
  const featured = Boolean(plan.badge);
  const Action = featured ? PrimaryLink : SecondaryLink;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border border-border p-6 md:p-7",
        !featured && "bg-(--surface)",
      )}
    >
      {featured ? (
        <>
          <Painting
            art="watercolor-wildflowers"
            sizes="(min-width: 768px) 400px, 100vw"
          />
          {/* A veil over the painting keeps the plan text readable. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-background/55 dark:bg-background/70"
          />
        </>
      ) : null}

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl tracking-[-0.02em]">{plan.name}</h3>
          {plan.badge ? (
            <span className="rounded-full bg-primary px-2.5 py-1.5 font-medium text-[11px] text-primary-foreground uppercase leading-none tracking-wide">
              {plan.badge}
            </span>
          ) : null}
        </div>

        <p className="mt-6 flex items-baseline gap-2">
          <span className="font-light font-sentient text-[52px] leading-none tracking-[-0.05em]">
            {formatUsd(plan.price)}
          </span>
          {plan.price > 0 ? (
            <span className="text-muted-foreground text-sm">one time</span>
          ) : null}
        </p>
        <p className="mt-4 text-[15px] text-body leading-[1.45]">
          {plan.summary}
        </p>

        <div className="mt-8 flex-1 border-border border-t pt-6">
          <p className="font-medium text-sm">Includes:</p>
          <ul className="mt-4 flex flex-col gap-3">
            {plan.features.map((feature) => (
              <li className="flex gap-2.5 text-[15px] text-body" key={feature}>
                <CheckIcon />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Action className="mt-8 w-full" href={plan.action.href}>
          {plan.action.label}
        </Action>
      </div>
    </div>
  );
}

/** Component plans only; client work lives on the services site. */
export function PricingSection() {
  return (
    <section className="py-20 md:py-28" id="pricing">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            badge="Pricing"
            lines={[
              { text: "Simple pricing." },
              { text: "Pay once, keep it.", muted: true },
            ]}
          />
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-3.5 py-2 text-sm md:self-auto">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-foreground"
            />
            One-time payments, no subscription
          </span>
        </div>

        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {COMPONENT_PLANS.map((plan, index) => (
            <li key={plan.name}>
              <Reveal className="h-full" delay={index * 100}>
                <PlanCard plan={plan} />
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-muted-foreground text-sm">
          Paid plans can be refunded in full within {PLAN_REFUND_DAYS} days.{" "}
          <Link
            className="text-foreground underline underline-offset-4 hover:no-underline"
            href="/refunds"
          >
            Refund policy
          </Link>
        </p>
      </Container>
    </section>
  );
}
