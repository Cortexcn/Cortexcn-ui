"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureWalkthrough01Meta } from "./meta";
import { FeatureWalkthroughPreview } from "./preview";

export function FeatureWalkthroughBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureWalkthrough01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureWalkthroughPreview />}
    />
  );
}
