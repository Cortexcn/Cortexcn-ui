"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { LoaderGlitchTextDemo } from "./files/components/loader-glitch-text-demo";

export function LoaderGlitchTextPreview() {
  return (
    <BlockPreviewFrame maxWidth={768}>
      <LoaderGlitchTextDemo />
    </BlockPreviewFrame>
  );
}
