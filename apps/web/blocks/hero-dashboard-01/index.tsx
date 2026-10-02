"use client";

import { BlockViewer } from "@/components/blocks/block-viewer";
import type { BlockDisplayProps } from "./meta";
import { heroDashboard01Meta } from "./meta";
import { HeroDashboardPreview } from "./preview";

export function HeroDashboardBlock({ embedded, ...props }: BlockDisplayProps) {
  return (
    <BlockViewer
      {...heroDashboard01Meta}
      {...props}
      embedded={embedded}
      preview={<HeroDashboardPreview />}
    />
  );
}
