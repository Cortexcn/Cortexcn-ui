import { UnderlineIcon } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function ToggleDisabled() {
  return (
    <Toggle disabled aria-label="Toggle underline">
      <UnderlineIcon />
    </Toggle>
  );
}
