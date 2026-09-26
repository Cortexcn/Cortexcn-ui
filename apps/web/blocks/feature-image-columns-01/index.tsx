"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureImageColumns01Meta } from "./meta";
import { FeatureImageColumnsPreview } from "./preview";

export function FeatureImageColumnsBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureImageColumns01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureImageColumnsPreview />}
    />
  );
}
