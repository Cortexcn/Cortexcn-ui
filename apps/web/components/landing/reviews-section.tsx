import { Container, Section, SectionHeading, Surface } from "./primitives";

// Placeholder testimonials for the template layout. Swap in real, attributable
// quotes (with permission) before you publish.
const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "We replaced a pile of fragmented AI experiments with one structured system the team actually relies on. The win was clarity as much as automation.",
    name: "Placeholder name",
    role: "Customer experience lead",
  },
  {
    quote:
      "AI finally feels built into how we work instead of bolted on the side. Decisions are faster and the noise is gone.",
    name: "Placeholder name",
    role: "Product lead",
  },
  {
    quote:
      "What stood out was the architectural thinking. This was not about adding tools, it was about redesigning how our operations run.",
    name: "Placeholder name",
    role: "Operations director",
  },
  {
    quote:
      "Response times dropped, but the bigger change is that the team feels in control. The systems are built around how we actually work.",
    name: "Placeholder name",
    role: "Head of operations",
  },
];

export function ReviewsSection() {
  return (
    <Section id="reviews">
      <Container>
        <SectionHeading
          description="Founders, product leaders, and operations teams choose structure to turn AI from scattered tools into real, scalable systems."
          eyebrow="Reviews"
          title="Trusted by teams who value structure"
        />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Surface className="flex flex-col justify-center gap-2 p-8">
            <span className="font-semibold text-5xl text-primary tracking-tight">
              4.9/5
            </span>
            <span className="text-muted-foreground">
              Average client satisfaction
            </span>
          </Surface>
          <Surface className="flex flex-col justify-center gap-2 p-8">
            <span className="font-semibold text-5xl text-foreground tracking-tight">
              200+
            </span>
            <span className="text-muted-foreground">
              Teams rely on structured systems
            </span>
          </Surface>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Surface
              className="flex flex-col gap-5 p-6"
              key={testimonial.quote}
            >
              <p className="text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-auto flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-9 shrink-0 border border-border bg-background/60"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-foreground text-sm">
                    {testimonial.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </span>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
}
