"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureMediaCards } from "./files/components/feature-media-cards";

export function FeatureMediaCardsPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureMediaCards className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
