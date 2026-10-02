"use client";

import { Shimmer } from "@/components/shimmer";
import { cn } from "@/lib/utils";

export interface ThinkingMessageProps {
  /** What the user asked. */
  prompt?: string;
  /** The assistant's status while it works, shown with a moving shimmer. */
  status?: string;
  className?: string;
}

/** A chat turn where the assistant's reply is a shimmering status line. */
export function ThinkingMessage({
  prompt = "Can you add a pricing table to the landing page?",
  status = "Reading the landing page...",
  className,
}: ThinkingMessageProps) {
  return (
    <div className={cn("flex w-full max-w-sm flex-col gap-3", className)}>
      <div className="self-end rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground text-sm">
        {prompt}
      </div>
      <div className="self-start rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm">
        <Shimmer as="span" duration={1.5} spread={3}>
          {status}
        </Shimmer>
      </div>
    </div>
  );
}
