"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureBentoGrid01Meta } from "./meta";
import { FeatureBentoGridPreview } from "./preview";

export function FeatureBentoGridBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureBentoGrid01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureBentoGridPreview />}
    />
  );
}
