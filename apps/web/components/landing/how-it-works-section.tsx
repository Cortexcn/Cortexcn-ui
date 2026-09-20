import { Container, Section, SectionHeading, Surface } from "./primitives";

const steps: { number: string; title: string; body: string }[] = [
  {
    number: "01",
    title: "Understand",
    body: "We identify the high-impact AI opportunities across your operations.",
  },
  {
    number: "02",
    title: "Design",
    body: "We architect structured AI systems aligned with your business logic.",
  },
  {
    number: "03",
    title: "Implement",
    body: "We integrate cleanly into your existing stack and workflows.",
  },
  {
    number: "04",
    title: "Optimize",
    body: "We refine and scale performance based on real usage.",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="process">
      <Container>
        <SectionHeading
          description="From analysis to optimization, a systematic AI implementation process built for long-term performance."
          eyebrow="Process"
          title="A simple process built for complex systems"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Surface className="flex flex-col gap-4 p-6" key={step.number}>
              <span className="flex size-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-primary text-sm">
                {step.number}
              </span>
              <h3 className="font-medium text-foreground text-lg">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">{step.body}</p>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
}
