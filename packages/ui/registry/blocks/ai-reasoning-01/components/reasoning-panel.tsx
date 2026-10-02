"use client";

// Reasoning renders markdown with Streamdown. Add its styles and let Tailwind
// see its classes in your global CSS (adjust the paths to your setup):
//
//   @import "streamdown/styles.css";
//   @source "../node_modules/streamdown/dist/*.js";
//   @source "../node_modules/@streamdown/code/dist/*.js";
//   @source "../node_modules/@streamdown/mermaid/dist/*.js";
//
// If your model writes math, also import "katex/dist/katex.min.css" once.

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/reasoning";
import { RotateCcwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SAMPLE_REASONING = `The user wants a revenue dashboard that loads fast, so I'll build on what the app already has.

**What the page needs**

- A headline number for this month's revenue
- A trend for the last 12 months
- A breakdown by plan

The \`stat-card-area-01\` block covers the first two in one card. For the breakdown, a ring chart reads better than a pie at small sizes and keeps the legend next to the values.

I'll install both with one command and wire them to the existing \`/api/revenue\` route.`;

const TOKEN_INTERVAL_MS = 45;

export interface ReasoningPanelProps {
  /** Markdown the panel streams in, word by word, as a stand-in for a model. */
  reasoning?: string;
  className?: string;
}

/**
 * A reasoning panel that opens while the text streams, folds away when it
 * finishes, and can replay. Swap the timer for your model's stream.
 */
export function ReasoningPanel({
  reasoning = SAMPLE_REASONING,
  className,
}: ReasoningPanelProps) {
  // Words with their trailing spaces, the way a model streams tokens.
  const tokens = reasoning.match(/\S+\s*/g) ?? [];
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const isStreaming = shown < tokens.length;

  useEffect(() => {
    if (!isStreaming) {
      return;
    }
    const timer = setInterval(
      () => setShown((count) => Math.min(count + 1, tokens.length)),
      TOKEN_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [isStreaming, tokens.length]);

  return (
    <div className={className}>
      <div className="flex w-full max-w-xl flex-col items-start gap-2">
        <Reasoning className="w-full" isStreaming={isStreaming} key={run}>
          <ReasoningTrigger />
          <ReasoningContent>{tokens.slice(0, shown).join("")}</ReasoningContent>
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
    </div>
  );
}
