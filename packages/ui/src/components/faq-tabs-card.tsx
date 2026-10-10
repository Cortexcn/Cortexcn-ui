"use client";

/*
 * Adapted from the Spectrum UI FAQ Tabs Card (https://ui.spectrumhq.in),
 * licensed under the Apache License 2.0 (https://www.apache.org/licenses/LICENSE-2.0).
 * Changes: neutral sample questions, a tab pill scoped to each card so two
 * cards on one page do not animate into each other, and the Inter font class
 * dropped so the card uses your font.
 */

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqTab {
  label: string;
  faqs: FaqItem[];
}

export interface FAQTabsCardProps {
  tabs?: FaqTab[];
  /** Index of the tab selected at first. */
  defaultTab?: number;
  /** Index of the question open at first, or -1 for none. */
  defaultOpenIndex?: number;
  footerLabel?: string;
  onFooterClick?: () => void;
  className?: string;
}

/** Sample content only. Pass your own `tabs` in real use. */
const DEFAULT_TABS: FaqTab[] = [
  {
    label: "General",
    faqs: [
      {
        question: "How do I get started?",
        answer:
          "Create an account, invite your team, and pick a starting template from the dashboard.",
      },
      {
        question: "Can I bring my existing data?",
        answer:
          "Yes. Import a CSV file, or connect one of the supported apps from Settings.",
      },
      {
        question: "Does it work on my phone?",
        answer:
          "Yes. The web app works in any mobile browser, and you can add it to your home screen.",
      },
    ],
  },
  {
    label: "Billing",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "All major credit and debit cards.",
      },
      {
        question: "Can I cancel at any time?",
        answer:
          "Yes. Cancel from Settings, and you keep access until the end of the billing period.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "Write to support within 14 days of a charge and we will sort it out.",
      },
    ],
  },
  {
    label: "Account",
    faqs: [
      {
        question: "How do I change my email address?",
        answer:
          "Open Settings, then Profile, and enter the new address. We send a link to confirm it.",
      },
      {
        question: "Can more than one person use an account?",
        answer:
          "Yes. Invite teammates from Settings, and give each one their own role.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Open Settings, then Account, and choose Delete. Your data is removed within 30 days.",
      },
    ],
  },
];

/** A tabbed FAQ card with animated answers and a support button at the bottom. */
export function FAQTabsCard({
  tabs: tabsProp = DEFAULT_TABS,
  defaultTab = 0,
  defaultOpenIndex = 0,
  footerLabel = "Contact Support",
  onFooterClick,
  className,
}: FAQTabsCardProps) {
  const pillId = useId();
  // An explicit `tabs={[]}` skips the default, so fall back instead of reading
  // `.faqs` off undefined.
  const tabs = tabsProp.length > 0 ? tabsProp : DEFAULT_TABS;
  const clampedDefaultTab = Math.min(Math.max(defaultTab, 0), tabs.length - 1);

  const [activeTab, setActiveTab] = useState(clampedDefaultTab);
  const [openIndex, setOpenIndex] = useState(defaultOpenIndex);

  const safeActiveTab = Math.min(Math.max(activeTab, 0), tabs.length - 1);
  const currentTab = tabs[safeActiveTab] ?? tabs[0];

  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-faq bg-card p-6 text-card-foreground",
        "shadow-faq",
        "dark:shadow-faq-dark",
        className,
      )}
    >
      <div className="flex h-9 items-center rounded-full bg-muted p-1">
        {tabs.map((tab, index) => {
          const active = index === safeActiveTab;
          return (
            <button
              aria-pressed={active}
              className="relative h-[27px] flex-1 rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50"
              key={tab.label}
              onClick={() => {
                setActiveTab(index);
                setOpenIndex(defaultOpenIndex);
              }}
              type="button"
            >
              {active ? (
                <motion.span
                  className="absolute inset-0 rounded-full bg-card"
                  layoutId={`faq-tab-pill-${pillId}`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 font-medium text-sm leading-5 transition-colors duration-base",
                  active
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground/80",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex-1 overflow-hidden rounded-faq-inner border border-border"
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 6 }}
          key={safeActiveTab}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {currentTab?.faqs.map((faq, index) => {
            const open = index === openIndex;
            return (
              <div
                className={cn(
                  "transition-colors duration-slow",
                  index > 0 && "border-border border-t",
                  open && "bg-muted/50",
                )}
                key={faq.question}
              >
                <button
                  aria-expanded={open}
                  className="flex min-h-[56px] w-full items-start justify-between gap-4 p-4 text-left"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  type="button"
                >
                  <span className="max-w-[248px] font-medium text-foreground text-sm leading-5">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    className="flex shrink-0"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <ChevronDown className="h-4 w-4 text-foreground" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                      exit={{ height: 0, opacity: 0 }}
                      initial={{ height: 0, opacity: 0 }}
                      key="answer"
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <p className="px-4 pb-[19px] text-foreground text-sm leading-5">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <motion.button
        className="mt-[25px] flex h-[34px] w-full shrink-0 items-center justify-center rounded-faq border border-border bg-card font-medium text-foreground text-sm leading-5 transition-colors hover:bg-muted"
        onClick={onFooterClick}
        transition={{ type: "spring", bounce: 0.4, duration: 0.35 }}
        type="button"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
      >
        {footerLabel}
      </motion.button>
    </div>
  );
}
