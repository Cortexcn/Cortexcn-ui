"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { featureMockupGrid01Meta } from "./meta";
import { FeatureMockupGridPreview } from "./preview";

export function FeatureMockupGridBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...featureMockupGrid01Meta}
      {...props}
      embedded={embedded}
      preview={<FeatureMockupGridPreview />}
    />
  );
}
