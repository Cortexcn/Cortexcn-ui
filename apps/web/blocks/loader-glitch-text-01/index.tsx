"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { loaderGlitchText01Meta } from "./meta";
import { LoaderGlitchTextPreview } from "./preview";

export function LoaderGlitchTextBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...loaderGlitchText01Meta}
      {...props}
      embedded={embedded}
      preview={<LoaderGlitchTextPreview />}
    />
  );
}
