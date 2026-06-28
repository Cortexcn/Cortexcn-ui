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
    date: "Step 1",
    title: "Create your account",
    description: "Sign up with your email and verify your address.",
  },
  {
    id: 2,
    date: "Step 2",
    title: "Set up your workspace",
    description: "Invite teammates and pick a plan.",
  },
  {
    id: 3,
    date: "Step 3",
    title: "Connect your data",
    description: "Import sources or start from a template.",
  },
  {
    id: 4,
    date: "Step 4",
    title: "Ship your first project",
    description: "Publish and share it with your team.",
  },
];

export default function TimelineCustomIndicators() {
  return (
    <Timeline defaultValue={2} className="max-w-lg">
      {items.map((item) => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineDate>{item.date}</TimelineDate>
            <TimelineTitle>{item.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator className="flex size-7 items-center justify-center bg-background text-xs font-medium group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground">
            {item.id}
          </TimelineIndicator>
          <TimelineSeparator />
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
