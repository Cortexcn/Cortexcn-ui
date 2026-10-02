"use client";

import { BlockPreviewFrame } from "@/blocks/_shared/preview-frame";
import { LoaderDotMatrixDemo } from "./files/components/loader-dot-matrix-demo";

export function LoaderDotMatrixPreview() {
  return (
    <BlockPreviewFrame maxWidth={768}>
      <LoaderDotMatrixDemo />
    </BlockPreviewFrame>
  );
}
