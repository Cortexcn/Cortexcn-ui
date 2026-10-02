"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureBentoGrid } from "./files/components/feature-bento-grid";

export function FeatureBentoGridPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureBentoGrid className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
