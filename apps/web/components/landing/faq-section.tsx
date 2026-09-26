"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

import { DotTexture, IndexMark, SectionLabel, TypeHeading } from "./kit";
import { Container } from "./primitives";

const FAQS = [
  {
    question: "What is Cortexcn?",
    answer:
      "A registry of React components, charts, and blocks built on shadcn/ui. You install them with the shadcn CLI, or your AI agent installs them for you.",
  },
  {
    question: "How do I install a component?",
    answer:
      "Add the @cortexcn registry to your components.json once, then run npx shadcn@latest add with the component name. The source is copied into your project, so there is no package to keep updated.",
  },
  {
    question: "Does it work with my AI agent?",
    answer:
      "Yes. Any agent that can run the shadcn CLI or use the shadcn MCP server can install Cortexcn components. That includes Claude Code, Cursor, and Codex.",
  },
  {
    question: "Can I change the code?",
    answer:
      "Yes. Components live in your repo as plain React and Tailwind. Edit the markup, props, or styles, and theme everything with your own CSS variables.",
  },
  {
    question: "What does it cost?",
    answer:
      "You can browse and install every component in the registry today. Paid plans with premium blocks and templates are on the way.",
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
          <TypeHeading lines={["Good questions.", "Straight answers."]} />
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
