"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { AgentSteps } from "./files/components/agent-steps";

export function AiChainOfThoughtPreview() {
  return (
    <BlockPreviewFrame maxWidth={448}>
      <AgentSteps />
    </BlockPreviewFrame>
  );
}
