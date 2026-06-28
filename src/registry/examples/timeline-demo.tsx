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
    date: "March 2024",
    title: "Project Initialized",
    description: "Set up the repository and the initial architecture.",
  },
  {
    id: 2,
    date: "April 2024",
    title: "Design System",
    description: "Built the component library and design tokens.",
  },
  {
    id: 3,
    date: "May 2024",
    title: "Beta Release",
    description: "Shipped the first beta to a group of early adopters.",
  },
  {
    id: 4,
    date: "June 2024",
    title: "Public Launch",
    description: "Opened the product up to everyone.",
  },
];

export default function TimelineDemo() {
  return (
    <Timeline defaultValue={3} className="max-w-lg">
      {items.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator />
          <TimelineSeparator />
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
