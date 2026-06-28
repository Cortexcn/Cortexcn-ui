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
    date: "09:00",
    title: "Doors open",
    description: "Check in at the front desk and grab a coffee.",
  },
  {
    id: 2,
    date: "10:30",
    title: "Keynote",
    description: "Opening talk on where the platform is heading.",
  },
  {
    id: 3,
    date: "13:00",
    title: "Workshops",
    description: "Hands-on sessions across three tracks.",
  },
  {
    id: 4,
    date: "17:00",
    title: "Closing",
    description: "Wrap up, prizes, and networking.",
  },
];

export default function TimelineLeftAlignedDates() {
  return (
    <Timeline defaultValue={2} className="max-w-xl">
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-24"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="-left-24 absolute top-0 w-16 text-right">
              {item.date}
            </TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
