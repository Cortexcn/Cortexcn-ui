import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
      <Button variant="outline" size="icon" aria-label="Add">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
