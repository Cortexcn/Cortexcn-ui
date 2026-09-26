import { Container, Section, Surface } from "./primitives";

const before = [
  "Manual workflows",
  "Data spread across tools",
  "Disconnected experiments",
  "Unpredictable results",
];

const after = [
  "Automated workflows",
  "Centralized, actionable insights",
  "Clear systems tied to real goals",
  "Predictable, scalable architecture",
];

function CrossIcon() {
  return (
    <svg
      aria-hidden
      className="size-4 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      className="size-4 shrink-0 text-primary"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ProblemSection() {
  return (
    <Section id="problem">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2.5 font-mono text-muted-foreground text-sm uppercase">
              <span aria-hidden className="size-2 bg-primary" />
              Reality
            </span>
            <h2 className="max-w-xl text-balance font-semibold text-3xl leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl">
              Most teams don&apos;t need more AI. They need AI that works.
            </h2>
            <p className="max-w-lg text-balance text-muted-foreground sm:text-lg">
              AI tools are everywhere. Without structure, strategy, and
              integration, they turn into disconnected experiments that never
              ship.
            </p>
          </div>

          <Surface className="p-6 sm:p-8">
            <div className="flex items-center gap-3 border-border/70 border-b pb-5">
              <span className="flex size-10 items-center justify-center border border-border bg-background/60 font-mono text-muted-foreground text-sm">
                OP
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-sm">
                  Operations lead
                </span>
                <span className="text-muted-foreground text-xs">
                  Placeholder persona
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
                  Before
                </span>
                <ul className="flex flex-col gap-3">
                  {before.map((item) => (
                    <li className="flex items-start gap-2.5" key={item}>
                      <CrossIcon />
                      <span className="text-muted-foreground text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-mono text-primary text-xs uppercase tracking-widest">
                  With structure
                </span>
                <ul className="flex flex-col gap-3">
                  {after.map((item) => (
                    <li className="flex items-start gap-2.5" key={item}>
                      <CheckIcon />
                      <span className="text-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Surface>
        </div>
      </Container>
    </Section>
  );
}
