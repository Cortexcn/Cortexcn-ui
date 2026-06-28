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
    date: "08:32",
    title: "Order placed",
    description: "We received your order and sent a confirmation.",
  },
  {
    id: 2,
    date: "11:15",
    title: "Packed",
    description: "Your items were picked and packed at the warehouse.",
  },
  {
    id: 3,
    date: "14:48",
    title: "Shipped",
    description: "The carrier picked up your parcel.",
  },
  {
    id: 4,
    date: "Pending",
    title: "Out for delivery",
    description: "Arriving soon to your address.",
  },
];

export default function TimelineDotIndicators() {
  return (
    <Timeline defaultValue={3} className="max-w-lg">
      {items.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator className="size-2.5 border-0 bg-primary/20 group-data-completed/timeline-item:bg-primary" />
          <TimelineSeparator />
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
