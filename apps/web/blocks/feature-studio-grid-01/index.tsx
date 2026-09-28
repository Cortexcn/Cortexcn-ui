"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureStudioGrid01Meta } from "./meta";
import { FeatureStudioGridPreview } from "./preview";

export function FeatureStudioGridBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureStudioGrid01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureStudioGridPreview />}
    />
  );
}
