import { ItalicIcon } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function ToggleWithText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  );
}
