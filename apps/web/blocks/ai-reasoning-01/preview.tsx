"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { ReasoningPanel } from "./files/components/reasoning-panel";

export function AiReasoningPreview() {
  return (
    <BlockPreviewFrame maxWidth={576}>
      <ReasoningPanel />
    </BlockPreviewFrame>
  );
}
