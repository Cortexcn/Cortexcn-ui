"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { loaderDotMatrix01Meta } from "./meta";
import { LoaderDotMatrixPreview } from "./preview";

export function LoaderDotMatrixBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...loaderDotMatrix01Meta}
      {...props}
      embedded={embedded}
      preview={<LoaderDotMatrixPreview />}
    />
  );
}
