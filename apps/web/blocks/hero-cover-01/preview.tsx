"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { HeroCover } from "./files/components/hero-cover";

export function HeroCoverPreview() {
  return (
    <BlockPreviewFrame maxWidth={1280}>
      <HeroCover />
    </BlockPreviewFrame>
  );
}
