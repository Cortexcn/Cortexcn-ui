"use client";

import { RotateCcwIcon, SparklesIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/button";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "../components/reasoning";
import { Shimmer } from "../components/shimmer";

const dashboardReasoning = `The user wants a revenue dashboard that loads fast, so I'll build on what the app already has.

**What the page needs**

- A headline number for this month's revenue
- A trend for the last 12 months
- A breakdown by plan

The \`stat-card-area-01\` block covers the first two in one card. For the breakdown, a ring chart reads better than a pie at small sizes and keeps the legend next to the values.

I'll install both with one command and wire them to the existing \`/api/revenue\` route.`;

const TOKEN_INTERVAL_MS = 45;

/** Words with their trailing spaces, the way a model streams tokens. */
const dashboardTokens = dashboardReasoning.match(/\S+\s*/g) ?? [];

export function ReasoningDemo() {
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const isStreaming = shown < dashboardTokens.length;

  useEffect(() => {
    if (!isStreaming) {
      return;
    }
    const timer = setTimeout(
      () => setShown((count) => count + 1),
      TOKEN_INTERVAL_MS,
    );
    return () => clearTimeout(timer);
  }, [isStreaming, shown]);

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <Reasoning className="w-full" isStreaming={isStreaming} key={run}>
        <ReasoningTrigger />
        <ReasoningContent>
          {dashboardTokens.slice(0, shown).join("")}
        </ReasoningContent>
      </Reasoning>
      <Button
        disabled={isStreaming}
        onClick={() => {
          setShown(0);
          setRun((value) => value + 1);
        }}
        size="sm"
        variant="outline"
      >
        <RotateCcwIcon />
        Stream again
      </Button>
    </div>
  );
}

const refundReasoning = `The order shipped 12 days ago, which is inside the 30 day refund window.

The customer says the box is unopened, and unopened items qualify for a **full refund**. No restocking fee applies, so the reply can confirm the refund and send the return label.`;

export function ReasoningFinished() {
  return (
    <Reasoning className="w-full max-w-xl" defaultOpen={false} duration={6}>
      <ReasoningTrigger />
      <ReasoningContent>{refundReasoning}</ReasoningContent>
    </Reasoning>
  );
}

const planReasoning = `1. Group the tasks by owner.
2. Move anything blocked to the end of the week.
3. Leave Friday afternoon free for review.`;

export function ReasoningCustomMessage() {
  return (
    <Reasoning className="w-full max-w-xl" defaultOpen={false} duration={3}>
      <ReasoningTrigger
        getThinkingMessage={(isStreaming, duration) =>
          isStreaming ? (
            <Shimmer as="span">Planning your week...</Shimmer>
          ) : (
            <span className="flex items-center gap-1.5">
              <SparklesIcon className="size-3.5" />
              Planned your week in {duration}s
            </span>
          )
        }
      />
      <ReasoningContent>{planReasoning}</ReasoningContent>
    </Reasoning>
  );
}
