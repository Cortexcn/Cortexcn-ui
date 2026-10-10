"use client";

import { useId, useState } from "react";

import {
  CARE_PLAN_MONTHLY_PRICE,
  COMPONENT_PLAN_PRICES,
  FREE_PLAN_LIMITS,
  formatUsd,
  PROJECT_STARTING_PRICES,
  SERVICE_PRICES,
} from "@/lib/service-pricing";
import { cn } from "@/lib/utils";

import { DotTexture, IndexMark, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

/** The usual timeline for a service, as /pricing lists it. */
function timeline(title: string) {
  return SERVICE_PRICES.find((price) => price.title === title)?.timeline ?? "";
}

/** What people ask before they hire me. Facts match /pricing and the terms. */
const FAQS = [
  {
    question: "What does a project cost?",
    answer: `Landing pages start at ${formatUsd(PROJECT_STARTING_PRICES.landing)}, websites at ${formatUsd(PROJECT_STARTING_PRICES.website)}, online stores at ${formatUsd(PROJECT_STARTING_PRICES.store)}, and web apps at ${formatUsd(PROJECT_STARTING_PRICES.app)}. After a short call or a few emails, you get a written quote with scope, price, and timeline, and that quote is what you pay.`,
  },
  {
    question: "How long does it take?",
    answer: `A landing page usually takes ${timeline("Landing pages")}, a website ${timeline("Websites")}, an online store ${timeline("E-commerce")}, and a web app ${timeline("Web apps + APIs")}. Your quote sets the exact dates before work starts.`,
  },
  {
    question: "How do payments work?",
    answer:
      "Projects are paid in two parts: 50% to start and 50% before launch. Retainers are billed monthly in advance. Every price is in US dollars, and project deposits are refunded in full until work starts.",
  },
  {
    question: "Will I see the work before launch?",
    answer:
      "Yes. Every week you get an update and a preview link to click through, in a shared Slack channel or the tool your team already uses.",
  },
  {
    question: "Who owns the code?",
    answer:
      "You do. The code lives in your repo, so you can host it anywhere and hand it to any developer later.",
  },
  {
    question: "What happens after launch?",
    answer: `Every project includes 30 days of fixes after launch. After that, the care plan covers updates and small fixes for ${formatUsd(CARE_PLAN_MONTHLY_PRICE)} a month, or I quote bigger changes as a new project.`,
  },
  {
    question: "Can you work on a site I already have?",
    answer:
      "Yes. I take on work in codebases that already exist, most often Next.js, React, and TypeScript. If yours runs on something else, tell me, and I will say honestly whether I am the right fit.",
  },
  {
    question: "What is the component library?",
    answer: `Cortexcn is also a library of React components, charts, and blocks that I build every project on. ${FREE_PLAN_LIMITS.components} components are free, and Pro (${formatUsd(COMPONENT_PLAN_PRICES.pro)}) and Ultra (${formatUsd(COMPONENT_PLAN_PRICES.ultra)}) are paid once, if you want to use them yourself.`,
  },
];

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function FaqItem({
  index,
  question,
  answer,
  open,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  const answerId = useId();
  return (
    <div className="group relative border-border border-b">
      <DotTexture
        className={cn(
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          open && "opacity-100",
        )}
      />
      <button
        aria-controls={answerId}
        aria-expanded={open}
        className="relative flex w-full items-start gap-4 px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:px-8"
        onClick={onToggle}
        type="button"
      >
        <span className="hidden h-8 shrink-0 items-center gap-2 sm:flex">
          <IndexMark value={index + 1} />
          <span
            aria-hidden="true"
            className="h-px w-16 border-border border-t border-dashed"
          />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex min-h-8 items-center text-xl leading-[1.3] tracking-[-0.05em] sm:text-2xl">
            {question}
          </span>
          <span
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
              open
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
            id={answerId}
          >
            <span className="overflow-hidden">
              <span className="block max-w-3xl pt-3 pb-2 text-base text-body leading-[1.3] tracking-[-0.05em]">
                {answer}
              </span>
            </span>
          </span>
        </span>
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center bg-foreground text-background transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <PlusIcon
            className={cn(
              "size-4 transition-transform duration-300",
              open && "rotate-45",
            )}
          />
        </span>
      </button>
    </div>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section aria-label="FAQ" className="w-full pt-20 pb-20" id="faq">
      <Container className="flex flex-col gap-6">
        <SectionLabel label="FAQs" section="faq" />
        <div className="flex flex-col gap-16">
          <TypeHeading lines={["Before you hire me.", "Straight answers."]} />
          <div className="border-border border-t">
            {FAQS.map((faq, index) => (
              <FaqItem
                answer={faq.answer}
                index={index}
                key={faq.question}
                onToggle={() => setOpen(open === index ? null : index)}
                open={open === index}
                question={faq.question}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
