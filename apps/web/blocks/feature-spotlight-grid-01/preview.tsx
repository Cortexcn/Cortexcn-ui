"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureSpotlightGrid } from "./files/components/feature-spotlight-grid";

export function FeatureSpotlightGridPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureSpotlightGrid className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
