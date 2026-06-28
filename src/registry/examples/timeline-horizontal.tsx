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
    date: "Mon",
    title: "Research",
    description: "Interviewed users and mapped the problem.",
  },
  {
    id: 2,
    date: "Tue",
    title: "Design",
    description: "Sketched flows and built a prototype.",
  },
  {
    id: 3,
    date: "Wed",
    title: "Develop",
    description: "Implemented the screens and wired up data.",
  },
  {
    id: 4,
    date: "Thu",
    title: "Review",
    description: "Tested, fixed bugs, and prepared to ship.",
  },
];

export default function TimelineHorizontal() {
  return (
    <Timeline defaultValue={2} orientation="horizontal" className="w-full">
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
