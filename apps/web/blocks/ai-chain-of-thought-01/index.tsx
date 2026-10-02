"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { aiChainOfThought01Meta } from "./meta";
import { AiChainOfThoughtPreview } from "./preview";

export function AiChainOfThoughtBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...aiChainOfThought01Meta}
      {...props}
      embedded={embedded}
      preview={<AiChainOfThoughtPreview />}
    />
  );
}
