import { cn } from "@/lib/utils";

import { Container, Section, SectionHeading, Surface } from "./primitives";

const beforeItems = [
  "Data silos",
  "Manual execution queue",
  "Scattered error logs",
];
const afterItems = [
  "Centralized analytics",
  "AI-powered execution",
  "Optimized resources",
];

const outcomes: { value: string; title: string; body: string }[] = [
  {
    value: "4-8 weeks",
    title: "From audit to live",
    body: "A structured rollout with clear milestones, not an open-ended project.",
  },
  {
    value: "Built to scale",
    title: "Designed for growth",
    body: "Systems built for long-term performance, not one-off automation experiments.",
  },
  {
    value: "200+ teams",
    title: "Trusted worldwide",
    body: "Teams that value structure run smarter systems, and so can you.",
  },
];

export function UseCasesSection() {
  return (
    <Section id="impact">
      <Container>
        <SectionHeading
          description="See how structured AI reshapes workflows, cuts friction, and lifts operational efficiency."
          eyebrow="Impact"
          title="Real results from structured AI systems"
        />

        <Surface className="mt-14 overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-background/40 p-6">
              <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
                Before
              </span>
              <ul className="mt-4 flex flex-col gap-3">
                {beforeItems.map((item) => (
                  <li
                    className="flex items-center gap-3 border border-border bg-card/60 px-4 py-3"
                    key={item}
                  >
                    <span
                      aria-hidden
                      className="size-2 bg-muted-foreground/50"
                    />
                    <span className="text-muted-foreground text-sm">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-primary/25 bg-primary/[0.06] p-6">
              <span className="font-mono text-primary text-xs uppercase tracking-widest">
                After
              </span>
              <ul className="mt-4 flex flex-col gap-3">
                {afterItems.map((item) => (
                  <li
                    className="flex items-center gap-3 border border-border bg-card/60 px-4 py-3"
                    key={item}
                  >
                    <span aria-hidden className="size-2 bg-primary" />
                    <span className="text-foreground text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Surface>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {outcomes.map((outcome, index) => (
            <Surface className="flex flex-col gap-2 p-6" key={outcome.title}>
              <span
                className={cn(
                  "font-semibold text-2xl tracking-tight md:text-3xl",
                  index === 2 ? "text-primary" : "text-foreground",
                )}
              >
                {outcome.value}
              </span>
              <span className="font-medium text-foreground text-sm">
                {outcome.title}
              </span>
              <p className="text-muted-foreground text-sm">{outcome.body}</p>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
}
