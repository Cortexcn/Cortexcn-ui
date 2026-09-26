"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { FeatureImageColumns } from "./files/components/feature-image-columns";

export function FeatureImageColumnsPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <FeatureImageColumns className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
