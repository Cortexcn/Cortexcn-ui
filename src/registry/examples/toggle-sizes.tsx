import { BoldIcon } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function ToggleSizes() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Toggle small">
        <BoldIcon />
      </Toggle>
      <Toggle size="default" aria-label="Toggle default">
        <BoldIcon />
      </Toggle>
      <Toggle size="lg" aria-label="Toggle large">
        <BoldIcon />
      </Toggle>
    </div>
  );
}
