"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { aiShimmer01Meta } from "./meta";
import { AiShimmerPreview } from "./preview";

export function AiShimmerBlock({ embedded, ...props }: BlockDisplayProps) {
  return (
    <BlockViewer
      {...aiShimmer01Meta}
      {...props}
      embedded={embedded}
      preview={<AiShimmerPreview />}
    />
  );
}
