import type { BlockFile } from "@/lib/blocks/types";

export const heroDashboard01Meta = {
  name: "Hero: Dashboard Preview",
  description:
    "A serif headline, a short pitch, and one call to action over a framed product dashboard on a soft photo wash.",
  registryName: "hero-dashboard-01",
  previewHeight: 1080,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
