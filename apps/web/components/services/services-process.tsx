import Link from "next/link";

import {
  DotTexture,
  type NumberedSection,
  SectionLabel,
} from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import {
  cadenceLabel,
  formatUsd,
  PROJECT_STARTING_PRICES,
  RETAINERS,
} from "@/lib/service-pricing";

import { ServicesLabel } from "./services-label";

/** How a project runs, in the same terms as the pricing FAQ. */
const STEPS = [
  {
    title: "Tell me what you need",
    body: "Write in through the contact form or by email: what you are building, and where you are stuck. I reply by email.",
  },
  {
    title: "Get a written quote",
    body: "After a short call or a few emails, you get a quote with scope, price, and timeline. That quote is what you pay: 50% to start and 50% before launch.",
  },
  {
    title: "See it every week",
    body: "Every week you get an update and a preview link to click through, in a shared Slack channel or the tool your team already uses.",
  },
  {
    title: "Launch with your code",
    body: "The code lives in your repo, built from the same tested components as Cortexcn. Every project includes 30 days of fixes after launch.",
  },
];

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
];

const WAYS_TO_WORK = [
  {
    title: "Per project",
    body: "A fixed scope and a written quote. Landing pages, websites, stores, and web apps each have a package with a starting price.",
    from: formatUsd(Math.min(...Object.values(PROJECT_STARTING_PRICES))),
    unit: cadenceLabel("project"),
    link: "See the packages",
  },
  {
    title: "On retainer",
    body: "I work on your team every month, from part time to full time. Pause or cancel with 2 weeks notice.",
    from: formatUsd(Math.min(...RETAINERS.map((plan) => plan.price))),
    unit: cadenceLabel("month"),
    link: "See the retainers",
  },
];

/**
 * How a project runs, what we build with, and the two ways to hire us. On the
 * home page it takes a numbered label and the `#process` anchor.
 */
export function ServicesProcess({ section }: { section?: NumberedSection }) {
  return (
    <section
      aria-labelledby="how-we-work"
      className="w-full scroll-mt-(--site-header-height) py-20 md:py-24"
      id={section ? "process" : undefined}
    >
      <Container className="flex flex-col gap-12">
        {section ? (
          <SectionLabel label="How I work" section={section} />
        ) : (
          <ServicesLabel label="How I work" />
        )}

        <h2
          className="max-w-3xl font-normal text-[2.5rem] leading-[1.1] tracking-[-0.06em] sm:text-5xl lg:text-[3.5rem]"
          id="how-we-work"
        >
          From the first email to launch.
        </h2>

        <ol className="grid border-border border-t border-l sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              className="flex min-h-64 flex-col gap-8 border-border border-r border-b p-6"
              key={step.title}
            >
              <span
                aria-hidden="true"
                className="font-pixel text-5xl text-primary leading-none"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-2xl leading-[1.2] tracking-[-0.05em]">
                  {step.title}
                </h3>
                <p className="text-base text-body leading-[1.3] tracking-[-0.05em]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative flex flex-col gap-4 bg-muted p-6 sm:flex-row sm:items-center sm:justify-between">
          <DotTexture className="opacity-50" />
          <p className="relative font-medium font-mono text-label-strong text-sm uppercase tracking-[-0.04em]">
            Built with
          </p>
          <ul className="relative flex flex-wrap gap-1.5">
            {STACK.map((item) => (
              <li
                className="bg-background px-1.5 py-0.5 font-medium font-mono text-foreground text-xs uppercase leading-[1.3] tracking-[-0.04em]"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-px border border-border bg-border md:grid-cols-2">
          {WAYS_TO_WORK.map((way) => (
            <div
              className="flex flex-col justify-between gap-10 bg-background p-6 sm:p-8"
              key={way.title}
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-medium text-3xl leading-[1.1] tracking-[-0.05em]">
                  {way.title}
                </h3>
                <p className="max-w-md text-base text-body leading-[1.3] tracking-[-0.05em]">
                  {way.body}
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <p className="flex items-baseline gap-1.5">
                  <span className="font-medium font-mono text-label-strong text-xs uppercase tracking-[-0.04em]">
                    From
                  </span>
                  <span className="text-4xl tabular-nums leading-none tracking-[-0.05em]">
                    {way.from}
                  </span>
                  <span className="text-muted-foreground text-sm tracking-[-0.03em]">
                    {way.unit}
                  </span>
                </p>
                <Link
                  className="font-medium font-mono text-foreground text-sm uppercase underline underline-offset-4 transition-colors hover:text-primary"
                  href="/pricing"
                >
                  {way.link}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
