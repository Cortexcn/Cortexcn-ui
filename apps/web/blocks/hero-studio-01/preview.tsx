"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { HeroStudio } from "./files/components/hero-studio";

export function HeroStudioPreview() {
  return (
    <BlockPreviewFrame maxWidth={1280}>
      <HeroStudio />
    </BlockPreviewFrame>
  );
}
