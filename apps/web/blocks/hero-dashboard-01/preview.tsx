"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { HeroDashboard } from "./files/components/hero-dashboard";

export function HeroDashboardPreview() {
  return (
    <BlockPreviewFrame maxWidth={1280}>
      <HeroDashboard />
    </BlockPreviewFrame>
  );
}
