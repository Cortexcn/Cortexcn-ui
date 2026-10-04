"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureMixedBento01Meta } from "./meta";
import { FeatureMixedBentoPreview } from "./preview";

export function FeatureMixedBentoBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureMixedBento01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureMixedBentoPreview />}
    />
  );
}
