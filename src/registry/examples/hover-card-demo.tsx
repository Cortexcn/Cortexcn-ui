import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function HoverCardDemo() {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="link">@cortexcn</Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">@cortexcn</div>
        <div className="text-sm">
          Components you own — copy the source into your project.
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Joined June 2026
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
