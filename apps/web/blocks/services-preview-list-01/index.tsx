"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { servicesPreviewList01Meta } from "./meta";
import { ServicesPreviewListPreview } from "./preview";

export function ServicesPreviewListBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...servicesPreviewList01Meta}
      {...props}
      embedded={embedded}
      preview={<ServicesPreviewListPreview />}
    />
  );
}
