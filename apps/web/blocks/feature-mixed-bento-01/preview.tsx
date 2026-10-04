"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureMixedBento } from "./files/components/feature-mixed-bento";

export function FeatureMixedBentoPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureMixedBento className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
