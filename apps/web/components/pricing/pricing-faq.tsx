import Link from "next/link";
import type { ReactNode } from "react";

import { PixelArt } from "@/components/landing/kit";
import { Container } from "@/components/landing/primitives";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import {
  CARE_PLAN_MONTHLY_PRICE,
  COMPONENT_PLAN_PRICES,
  formatUsd,
  PLAN_REFUND_DAYS,
} from "@/lib/service-pricing";

import { CopyEmailButton } from "./copy-email-button";

/* 7x7 pixel icons, one per question. */
const ICONS = {
  estimate: [
    "#######",
    "#.....#",
    "#######",
    "#.#.#.#",
    "#######",
    "#.#.#.#",
    "#######",
  ],
  payments: [
    "#######",
    "#.....#",
    "#######",
    "#######",
    "#.....#",
    "#.##..#",
    "#######",
  ],
  refunds: [
    "..#....",
    ".##....",
    "#######",
    ".##...#",
    "..#...#",
    "......#",
    "..#####",
  ],
  plans: [
    "..###..",
    ".#####.",
    "#######",
    "#..#..#",
    "#..#..#",
    "#..#..#",
    "#######",
  ],
  license: [
    "###....",
    "#.#....",
    "###....",
    ".#.....",
    ".##....",
    ".#.....",
    ".##....",
  ],
  updates: [
    "...#...",
    "..###..",
    ".#.#.#.",
    "...#...",
    "...#...",
    ".......",
    "#######",
  ],
  custom: [
    "...#...",
    "...#...",
    "..###..",
    "#######",
    "..###..",
    "...#...",
    "...#...",
  ],
  stack: [
    ".......",
    "..#.#..",
    ".#...#.",
    "#.....#",
    ".#...#.",
    "..#.#..",
    ".......",
  ],
  progress: [
    "#######",
    "#.....#",
    "#.#.#.#",
    "#.....#",
    "#######",
    "##.....",
    "#......",
  ],
  support: [
    "#######",
    "##...##",
    "#.#.#.#",
    "#..#..#",
    "#.....#",
    "#.....#",
    "#######",
  ],
  changes: [
    ".....##",
    "....###",
    "...###.",
    "..###..",
    ".###...",
    "###....",
    "##.....",
  ],
  team: [
    "......#",
    ".....##",
    "#...##.",
    "##.##..",
    ".###...",
    "..#....",
    ".......",
  ],
} as const;

interface Question {
  icon: keyof typeof ICONS;
  question: string;
  answer: ReactNode;
}

const linkClassName =
  "text-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-primary";

const QUESTIONS: Question[] = [
  {
    icon: "estimate",
    question: "Is the estimate the final price?",
    answer:
      "No, it is a starting point. After a short call or a few emails, you get a written quote with scope, price, and timeline, and that quote is what you pay.",
  },
  {
    icon: "payments",
    question: "How do payments work?",
    answer:
      "Projects are paid in two parts: 50% to start and 50% before launch. Retainers are billed monthly in advance, and component plans are paid once. Every price is in US dollars.",
  },
  {
    icon: "refunds",
    question: "Do you offer refunds?",
    answer: (
      <>
        Yes. Component plans can be refunded within {PLAN_REFUND_DAYS} days, and
        project deposits are refunded in full until work starts. The{" "}
        <Link className={linkClassName} href="/refunds">
          refund policy
        </Link>{" "}
        has the details.
      </>
    ),
  },
  {
    icon: "plans",
    question: "How do Pro and Ultra work?",
    answer: `Both are paid once, with no subscription. Pro is ${formatUsd(COMPONENT_PLAN_PRICES.pro)} for every component, and Ultra is ${formatUsd(COMPONENT_PLAN_PRICES.ultra)} for everything, including future components and templates. Checkout is not open yet, so the plan buttons ask for early access, and we email you when it opens.`,
  },
  {
    icon: "license",
    question: "Can I use the components in client work?",
    answer:
      "Yes. Free components are MIT licensed. Pro and Ultra components can go into as many personal and client projects as you like; you just cannot resell or publish their source on its own.",
  },
  {
    icon: "updates",
    question: "Do paid plans get updates?",
    answer:
      "Pro includes fixes and updates to every component in it. Ultra also includes every new component and template we release, for life.",
  },
  {
    icon: "custom",
    question: "Do you only sell fixed packages?",
    answer:
      "No. The packages are starting points, and every quote is written for your project. We also take on work in a codebase you already have.",
  },
  {
    icon: "stack",
    question: "What stack do you build with?",
    answer:
      "Most projects use Next.js, React, TypeScript, and Tailwind CSS, with Node.js and PostgreSQL behind them. If your product runs on something else, tell us, and we will say honestly whether we are the right fit.",
  },
  {
    icon: "progress",
    question: "How do you share progress?",
    answer:
      "Every week you get an update and a preview link to click through. Retainers get weekly updates too, and Full time adds updates in your team chat every day.",
  },
  {
    icon: "support",
    question: "How do I reach you for support?",
    answer: (
      <>
        Write to{" "}
        <a className={linkClassName} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>{" "}
        or use the{" "}
        <Link className={linkClassName} href="/contact">
          contact form
        </Link>
        . Once a project starts, we also share a channel in Slack, or in the
        tool your team already uses.
      </>
    ),
  },
  {
    icon: "changes",
    question: "What if I need changes after launch?",
    answer: `Every project includes 30 days of fixes after launch. After that, the care plan covers updates and small fixes for ${formatUsd(CARE_PLAN_MONTHLY_PRICE)} a month, or we quote bigger changes as a new project.`,
  },
  {
    icon: "team",
    question: "Why work with you?",
    answer:
      "You work directly with the people who build Cortexcn. Your project is built from the same tested components, and the code is yours, in your repo.",
  },
];

/** Answers to what people ask before they buy a plan or start a project. */
export function PricingFaq() {
  return (
    <section
      aria-labelledby="pricing-faq-heading"
      className="w-full scroll-mt-[calc(var(--site-header-height)+1.5rem)] py-20 md:py-24"
      id="pricing-faq"
    >
      <Container className="flex flex-col gap-16">
        <h2
          className="mx-auto max-w-3xl text-balance text-center font-normal text-[2rem] leading-[1.25] tracking-[-0.05em] sm:text-[2.5rem]"
          id="pricing-faq-heading"
        >
          Questions about{" "}
          <mark className="bg-primary box-decoration-clone px-1.5 text-primary-foreground">
            plans, projects, or payments
          </mark>
          ? Start here.
        </h2>

        <dl className="mx-auto grid w-full max-w-5xl gap-x-16 gap-y-12 md:grid-cols-2">
          {QUESTIONS.map((item) => (
            <div className="flex flex-col gap-4" key={item.question}>
              <dt className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center bg-primary text-primary-foreground"
                >
                  <PixelArt className="size-3.5" rows={ICONS[item.icon]} />
                </span>
                <span className="font-medium font-mono text-base leading-[1.3] tracking-[-0.04em]">
                  {item.question}
                </span>
              </dt>
              <dd className="text-body text-lg leading-[1.45] tracking-[-0.03em]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-center text-body text-lg leading-[1.45] tracking-[-0.03em]">
          Did not find your answer?{" "}
          <Link
            className="text-primary underline decoration-1 underline-offset-4"
            href="/contact"
          >
            Send us a message
          </Link>{" "}
          or <CopyEmailButton />.
        </p>
      </Container>
    </section>
  );
}
