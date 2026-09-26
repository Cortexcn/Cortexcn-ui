"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureSpotlightGrid01Meta } from "./meta";
import { FeatureSpotlightGridPreview } from "./preview";

export function FeatureSpotlightGridBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureSpotlightGrid01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureSpotlightGridPreview />}
    />
  );
}
