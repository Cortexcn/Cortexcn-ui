"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureMockupGrid } from "./files/components/feature-mockup-grid";

export function FeatureMockupGridPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureMockupGrid className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
