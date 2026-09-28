"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureStudioGrid } from "./files/components/feature-studio-grid";

export function FeatureStudioGridPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureStudioGrid className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
