import { Check, Clock, Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const ACTIVE_STEP = 3;

const items = [
  {
    id: 1,
    title: "Checkout",
    description: "Cloned the repository at main@a1b2c3d.",
  },
  {
    id: 2,
    title: "Install",
    description: "Installed 482 packages in 12s.",
  },
  {
    id: 3,
    title: "Build",
    description: "Compiling the production bundle...",
  },
  {
    id: 4,
    title: "Test",
    description: "Waiting for the build to finish.",
  },
  {
    id: 5,
    title: "Deploy",
    description: "Queued.",
  },
];

function StepIcon({ id }: { id: number }) {
  if (id < ACTIVE_STEP) {
    return <Check className="size-3.5" />;
  }
  if (id === ACTIVE_STEP) {
    return <Loader className="size-3.5 animate-spin" />;
  }
  return <Clock className="size-3.5 text-muted-foreground" />;
}

export default function TimelinePipeline() {
  return (
    <Timeline defaultValue={ACTIVE_STEP - 1} className="max-w-lg">
      {items.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineTitle
              className={cn(item.id === ACTIVE_STEP && "text-primary")}
            >
              {item.title}
            </TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator className="flex size-7 items-center justify-center bg-background group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
            <StepIcon id={item.id} />
          </TimelineIndicator>
          <TimelineSeparator />
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
