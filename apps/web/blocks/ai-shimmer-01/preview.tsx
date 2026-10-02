"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { ThinkingMessage } from "./files/components/thinking-message";

export function AiShimmerPreview() {
  return (
    <BlockPreviewFrame maxWidth={384}>
      <ThinkingMessage />
    </BlockPreviewFrame>
  );
}
