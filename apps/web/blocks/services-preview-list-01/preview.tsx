"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { ServicesPreviewList } from "./files/components/services-preview-list";

export function ServicesPreviewListPreview() {
  return (
    <BlockPreviewFrame maxWidth={1152}>
      <ServicesPreviewList className="py-4 sm:py-8" />
    </BlockPreviewFrame>
  );
}
