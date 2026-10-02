"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { AgentQueue } from "./files/components/agent-queue";

export function AiQueuePreview() {
  return (
    <BlockPreviewFrame maxWidth={448}>
      <AgentQueue />
    </BlockPreviewFrame>
  );
}
