"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItemData {
  question: React.ReactNode;
  answer: React.ReactNode;
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Self-contained single-open accordion for the FAQ. State is local, and the
 * panel animates height with a grid-rows transition so it stays smooth in both
 * themes without depending on any primitive's data attributes.
 */
export function Accordion({
  items,
  className,
  defaultOpen = null,
}: {
  items: AccordionItemData[];
  className?: string;
  defaultOpen?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);

  return (
    <div
      className={cn("divide-y divide-border border-border border-y", className)}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: static FAQ list
          <div key={index}>
            <h3 className="m-0">
              <button
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                type="button"
              >
                <span className="font-medium text-base text-foreground">
                  {item.question}
                </span>
                <ChevronDownIcon
                  className={cn(
                    "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 text-muted-foreground text-sm leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
