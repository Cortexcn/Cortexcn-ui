import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PopoverSimple() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Show details</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-sm text-muted-foreground">
        Cortexcn popovers render in a portal and close on outside click or the
        Escape key.
      </PopoverContent>
    </Popover>
  );
}
