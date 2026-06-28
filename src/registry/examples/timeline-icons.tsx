import { Flag, Package, Rocket, Wrench } from "lucide-react";

import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const items = [
  {
    id: 1,
    icon: Flag,
    date: "Q1",
    title: "Kickoff",
    description: "Aligned on goals and scoped the roadmap.",
  },
  {
    id: 2,
    icon: Wrench,
    date: "Q2",
    title: "Build",
    description: "Implemented the core features and internal tooling.",
  },
  {
    id: 3,
    icon: Package,
    date: "Q3",
    title: "Package",
    description: "Hardened the API and prepared the release.",
  },
  {
    id: 4,
    icon: Rocket,
    date: "Q4",
    title: "Launch",
    description: "Rolled out to production and announced it.",
  },
];

export default function TimelineIcons() {
  return (
    <Timeline defaultValue={2} className="max-w-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <TimelineItem key={item.id} step={item.id}>
            <TimelineHeader>
              <TimelineDate>{item.date}</TimelineDate>
              <TimelineTitle>{item.title}</TimelineTitle>
            </TimelineHeader>
            <TimelineIndicator className="flex size-7 items-center justify-center bg-background group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
              <Icon className="size-3.5" />
            </TimelineIndicator>
            <TimelineSeparator />
            <TimelineContent>{item.description}</TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
