"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { aiReasoning01Meta } from "./meta";
import { AiReasoningPreview } from "./preview";

export function AiReasoningBlock({ embedded, ...props }: BlockDisplayProps) {
  return (
    <BlockViewer
      {...aiReasoning01Meta}
      {...props}
      embedded={embedded}
      preview={<AiReasoningPreview />}
    />
  );
}
