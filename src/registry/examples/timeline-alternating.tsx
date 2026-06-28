import { cn } from "@/lib/utils";
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
    date: "2019",
    title: "Founded",
    description: "Started in a small garage with two laptops.",
  },
  {
    id: 2,
    date: "2021",
    title: "Seed Round",
    description: "Raised our first round and grew the team to ten.",
  },
  {
    id: 3,
    date: "2023",
    title: "1M Users",
    description: "Crossed a million active users worldwide.",
  },
  {
    id: 4,
    date: "2024",
    title: "Global",
    description: "Opened offices on three continents.",
  },
];

export default function TimelineAlternating() {
  return (
    <Timeline defaultValue={3} className="mx-auto max-w-2xl">
      {items.map((item, index) => {
        const isEven = index % 2 === 0;
        return (
          <TimelineItem
            key={item.id}
            step={item.id}
            className={cn(
              "group-data-[orientation=vertical]/timeline:ms-0",
              isEven
                ? "items-end pe-[calc(50%+1.5rem)] text-right"
                : "items-start ps-[calc(50%+1.5rem)]",
            )}
          >
            <TimelineHeader>
              <TimelineDate>{item.date}</TimelineDate>
              <TimelineTitle>{item.title}</TimelineTitle>
            </TimelineHeader>
            <TimelineIndicator className="group-data-[orientation=vertical]/timeline:left-1/2" />
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:left-1/2" />
            <TimelineContent>{item.description}</TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
