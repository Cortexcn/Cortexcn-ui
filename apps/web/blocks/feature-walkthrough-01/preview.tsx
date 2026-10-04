"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureWalkthrough } from "./files/components/feature-walkthrough";

export function FeatureWalkthroughPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureWalkthrough className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
