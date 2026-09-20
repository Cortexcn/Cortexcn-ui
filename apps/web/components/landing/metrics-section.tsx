import { cn } from "@/lib/utils";

import { Container, Section, SectionHeading, Surface } from "./primitives";

const stats: { value: string; label: string; accent?: boolean }[] = [
  { value: "50+", label: "Production components" },
  { value: "3+", label: "Agents supported" },
  { value: "1", label: "Command to connect", accent: true },
  { value: "MIT", label: "Open source license" },
];

// Dividers are hand placed per breakpoint: a 2x2 grid on mobile needs a
// right divider between columns and a bottom divider between rows, while
// the 4-up desktop grid only needs right dividers between columns.
const dividerClassName = [
  "border-border/60 border-r border-b md:border-r md:border-b-0",
  "border-border/60 border-b md:border-r md:border-b-0",
  "border-border/60 border-r",
  "",
];

export function MetricsSection() {
  return (
    <Section id="metrics">
      <Container className="flex flex-col items-center">
        <SectionHeading
          description="Real components, one connection, and code you own."
          eyebrow="By the numbers"
          title="Built to move fast"
        />

        <Surface className="mt-14 w-full overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-2 px-6 py-10 text-center",
                  dividerClassName[index],
                )}
                key={stat.label}
              >
                <span
                  className={cn(
                    "font-semibold text-4xl tracking-tight md:text-5xl",
                    stat.accent
                      ? "text-foreground dark:text-foreground"
                      : "text-foreground",
                  )}
                >
                  {stat.value}
                </span>
                <span className="text-muted-foreground text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Surface>
      </Container>
    </Section>
  );
}
