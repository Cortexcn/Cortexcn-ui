import { GitBranchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ButtonWithIcon() {
  return (
    <Button variant="outline" size="sm">
      <GitBranchIcon data-icon="inline-start" /> New Branch
    </Button>
  );
}
