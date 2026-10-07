import Link from "next/link";

import { ActionLink, TypeHeading } from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import {
  formatUsd,
  PROJECT_STARTING_PRICES,
  RETAINERS,
} from "@/lib/service-pricing";

import { ServicesLabel } from "./services-label";

const projectsFrom = Math.min(...Object.values(PROJECT_STARTING_PRICES));
const retainersFrom = Math.min(...RETAINERS.map((plan) => plan.price));

/** Short facts under the intro, all read from the pricing data. */
const FACTS = [
  { value: formatUsd(projectsFrom), label: "Projects start at" },
  { value: `${formatUsd(retainersFrom)}/mo`, label: "Retainers start at" },
  { value: "30 days", label: "Of fixes after launch" },
];

export function ServicesIntro() {
  return (
    <section aria-labelledby="services-intro" className="w-full py-20 md:py-24">
      <Container className="flex flex-col gap-12">
        <ServicesLabel label="Client work" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <div id="services-intro">
            <TypeHeading
              lines={[
                "Need more than components?",
                "Hire the team behind them.",
              ]}
              size="display"
            />
          </div>
          <div className="flex flex-col items-start gap-6">
            <p className="text-body text-lg leading-[1.4] tracking-[-0.04em]">
              We build for clients too, from a single landing page to a full
              product, an AI pipeline, or a research paper. Every build ships
              with its code in your repo, per project or on retainer.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ActionLink href="/contact" label="Start a project" />
              <Link
                className="font-medium font-mono text-foreground text-sm uppercase underline underline-offset-4 transition-colors hover:text-primary"
                href="/pricing"
              >
                See every price
              </Link>
            </div>
          </div>
        </div>

        <dl className="grid border-border border-t border-l sm:grid-cols-3">
          {FACTS.map((fact) => (
            <div
              className="flex flex-col gap-2 border-border border-r border-b p-6"
              key={fact.label}
            >
              <dt className="font-medium font-mono text-label-strong text-xs uppercase leading-[1.3] tracking-[-0.04em]">
                {fact.label}
              </dt>
              <dd className="text-4xl tabular-nums leading-none tracking-[-0.05em]">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
