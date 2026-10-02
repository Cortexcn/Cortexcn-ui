"use client";

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@bklitui/ui/components/chain-of-thought";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenIcon,
  CodeIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export interface AgentStep {
  icon: LucideIcon;
  label: string;
  description?: string;
  /** Shown as chips under the step, such as pages the agent searched. */
  sources?: string[];
}

const SAMPLE_STEPS: AgentStep[] = [
  {
    icon: SearchIcon,
    label: "Searching for the refund policy",
    sources: ["help-center/refunds", "terms#payments"],
  },
  {
    icon: BookOpenIcon,
    label: "Reading the order history",
    description: "Order 4471 shipped 12 days ago, inside the 30 day window.",
  },
  {
    icon: ShieldCheckIcon,
    label: "Checking the refund rules",
    description: "Unopened items qualify for a full refund.",
  },
  {
    icon: CodeIcon,
    label: "Drafting the reply",
  },
];

const STEP_INTERVAL_MS = 1400;

export interface AgentStepsProps {
  /** Header while the agent works. */
  title?: string;
  steps?: AgentStep[];
  className?: string;
}

/**
 * An agent's progress, one step at a time: finished steps tick off, the
 * current one stays active, and the header sums up the run when it ends.
 */
export function AgentSteps({
  title = "Working on the refund request",
  steps = SAMPLE_STEPS,
  className,
}: AgentStepsProps) {
  const [run, setRun] = useState(0);
  const [stage, setStage] = useState(0);
  const done = stage >= steps.length;

  useEffect(() => {
    if (done) {
      return;
    }
    const timer = setInterval(
      () => setStage((value) => Math.min(value + 1, steps.length)),
      STEP_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [done, steps.length]);

  return (
    <div className={className}>
      <div className="flex w-full max-w-md flex-col items-start gap-4">
        <ChainOfThought defaultOpen key={run}>
          <ChainOfThoughtHeader>
            {done ? `Worked through ${steps.length} steps` : title}
          </ChainOfThoughtHeader>
          <ChainOfThoughtContent>
            {steps.slice(0, stage + 1).map((step, index) => (
              <ChainOfThoughtStep
                description={step.description}
                icon={step.icon}
                key={step.label}
                label={step.label}
                status={index < stage ? "complete" : "active"}
              >
                {step.sources ? (
                  <ChainOfThoughtSearchResults>
                    {step.sources.map((source) => (
                      <ChainOfThoughtSearchResult key={source}>
                        {source}
                      </ChainOfThoughtSearchResult>
                    ))}
                  </ChainOfThoughtSearchResults>
                ) : null}
              </ChainOfThoughtStep>
            ))}
          </ChainOfThoughtContent>
        </ChainOfThought>
        <Button
          disabled={!done}
          onClick={() => {
            setStage(0);
            setRun((value) => value + 1);
          }}
          size="sm"
          variant="outline"
        >
          <RotateCcwIcon />
          Run again
        </Button>
      </div>
    </div>
  );
}
