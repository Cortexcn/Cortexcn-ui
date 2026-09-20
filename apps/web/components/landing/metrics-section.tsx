import { Container, Section, SectionHeading, Surface } from "./primitives";

// Illustrative figures for the template layout. Replace with your own before launch.
const metrics: { value: string; label: string; body: string }[] = [
  {
    value: "+40%",
    label: "Operational efficiency",
    body: "Better workflow coordination and automated task routing across teams.",
  },
  {
    value: "-60%",
    label: "Manual workload",
    body: "Fewer repetitive tasks through intelligent, structured automation.",
  },
  {
    value: "Real time",
    label: "Faster decision-making",
    body: "Live insights that replace delayed, fragmented reporting.",
  },
];

export function MetricsSection() {
  return (
    <Section id="metrics">
      <Container className="flex flex-col items-center">
        <SectionHeading
          description="We don't just deploy models. We build systems that produce measurable results across your core operations."
          eyebrow="Outcome"
          title="Real impact you can measure"
        />

        <div className="mt-14 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Surface className="flex flex-col gap-3 p-8" key={metric.label}>
              <span className="font-semibold text-5xl text-primary tracking-tight">
                {metric.value}
              </span>
              <span className="font-medium text-foreground">
                {metric.label}
              </span>
              <p className="text-muted-foreground text-sm">{metric.body}</p>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
}
