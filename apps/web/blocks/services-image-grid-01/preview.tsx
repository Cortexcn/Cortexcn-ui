"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { ServicesImageGrid } from "./files/components/services-image-grid";

export function ServicesImageGridPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <ServicesImageGrid className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
