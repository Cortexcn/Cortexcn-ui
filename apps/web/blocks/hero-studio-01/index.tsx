"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { heroStudio01Meta } from "./meta";
import { HeroStudioPreview } from "./preview";

export function HeroStudioBlock({ embedded, ...props }: BlockDisplayProps) {
  return (
    <BlockViewer
      {...heroStudio01Meta}
      {...props}
      embedded={embedded}
      preview={<HeroStudioPreview />}
    />
  );
}
