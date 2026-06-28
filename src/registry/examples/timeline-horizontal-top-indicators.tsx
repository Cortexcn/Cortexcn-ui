import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const items = [
  {
    id: 1,
    title: "Cart",
    description: "Review the items in your cart.",
  },
  {
    id: 2,
    title: "Shipping",
    description: "Add your delivery address.",
  },
  {
    id: 3,
    title: "Payment",
    description: "Choose how you want to pay.",
  },
  {
    id: 4,
    title: "Done",
    description: "Confirm and place your order.",
  },
];

export default function TimelineHorizontalTopIndicators() {
  return (
    <Timeline defaultValue={2} orientation="horizontal" className="w-full">
      {items.map((item) => (
        <TimelineItem key={item.id} step={item.id} className="text-center">
          <TimelineHeader>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator className="flex size-7 items-center justify-center bg-background text-xs font-medium group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
            {item.id}
          </TimelineIndicator>
          <TimelineSeparator className="group-data-[orientation=horizontal]/timeline:translate-x-7" />
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
