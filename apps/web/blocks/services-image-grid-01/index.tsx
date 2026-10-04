"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { servicesImageGrid01Meta } from "./meta";
import { ServicesImageGridPreview } from "./preview";

export function ServicesImageGridBlock({
  embedded,
  ...props
}: BlockDisplayProps) {
  return (
    <BlockViewer
      {...servicesImageGrid01Meta}
      {...props}
      embedded={embedded}
      preview={<ServicesImageGridPreview />}
    />
  );
}
