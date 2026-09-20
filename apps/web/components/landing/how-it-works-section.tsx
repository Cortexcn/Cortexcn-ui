import { Container, Section, SectionHeading, Surface } from "./primitives";

const steps: { number: string; title: string; body: string }[] = [
  {
    number: "01",
    title: "Connect the MCP server",
    body: "Run one command to link Cortexcn to your agent.",
  },
  {
    number: "02",
    title: "Pick components",
    body: "Browse the library and choose what your page needs.",
  },
  {
    number: "03",
    title: "Describe the page",
    body: "Tell your agent the layout and content in plain words.",
  },
  {
    number: "04",
    title: "Ship",
    body: "Your agent assembles the page. You review, edit, and deploy.",
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works">
      <Container>
        <SectionHeading
          description="From an empty project to a real page, without leaving your agent."
          eyebrow="How it works"
          title="Four steps to a shipped page"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <Surface className="p-6" key={step.number}>
              <span className="font-mono text-foreground text-sm dark:text-foreground">
                {step.number}
              </span>
              <h3 className="mt-4 font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{step.body}</p>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
}
