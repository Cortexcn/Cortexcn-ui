import type { BlockFile } from "@/lib/blocks/types";

export const aiQueue01Meta = {
  name: "AI Assistant: Queue",
  description:
    "What an agent has lined up: queued messages with attachments and a remove action, above the run's todo list.",
  registryName: "ai-queue-01",
  previewHeight: 560,
} as const;

export interface BlockDisplayProps {
  files: BlockFile[];
  embedded?: boolean;
}
