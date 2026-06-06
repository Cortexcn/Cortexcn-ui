import { SendIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function InputGroupButtonDemo() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroupInput placeholder="Send a message..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Send">
          <SendIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
