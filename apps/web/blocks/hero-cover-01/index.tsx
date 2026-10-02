"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { heroCover01Meta } from "./meta";
import { HeroCoverPreview } from "./preview";

export function HeroCoverBlock({ embedded, ...props }: BlockDisplayProps) {
  return (
    <BlockViewer
      {...heroCover01Meta}
      {...props}
      embedded={embedded}
      preview={<HeroCoverPreview />}
    />
  );
}
