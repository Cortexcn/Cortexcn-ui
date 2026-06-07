import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function HoverCardDelays() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <Button variant="outline">Instant</Button>
        </HoverCardTrigger>
        <HoverCardContent>Opens immediately on hover.</HoverCardContent>
      </HoverCard>

      <HoverCard openDelay={500} closeDelay={200}>
        <HoverCardTrigger asChild>
          <Button variant="outline">Delayed</Button>
        </HoverCardTrigger>
        <HoverCardContent>Waits 500ms before opening.</HoverCardContent>
      </HoverCard>
    </div>
  );
}
