"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { aiQueue01Meta } from "./meta";
import { AiQueuePreview } from "./preview";

export function AiQueueBlock({ embedded, ...props }: BlockDisplayProps) {
  return (
    <BlockViewer
      {...aiQueue01Meta}
      {...props}
      embedded={embedded}
      preview={<AiQueuePreview />}
    />
  );
}
