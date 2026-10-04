import type { BlockFile } from "@/lib/blocks/types";

export const servicesPreviewList01Meta = {
  name: "Services: Preview List",
  description:
    "A large numbered list of services beside a panel that stays in view and wipes in the image and description of the one you point at.",
  registryName: "services-preview-list-01",
  previewHeight: 840,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
