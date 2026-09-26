"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureMediaCards01Meta } from "./meta";
import { FeatureMediaCardsPreview } from "./preview";

export function FeatureMediaCardsBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureMediaCards01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureMediaCardsPreview />}
    />
  );
}
