import type { ReactNode } from "react";

import { Container } from "./primitives";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";

interface QualityPoint {
  title: string;
  description: string;
  icon: ReactNode;
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

/** What every component ships with, each claim checked against the source. */
const POINTS: QualityPoint[] = [
  {
    title: "Typed source",
    description:
      "Written in TypeScript with plain props, so your editor and your AI agent can read every option.",
    icon: (
      <Glyph>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
      </Glyph>
    ),
  },
  {
    title: "Keyboard ready",
    description:
      "Interactive pieces use real buttons, ARIA states, and arrow keys, like the accordion and Command Search.",
    icon: (
      <Glyph>
        <rect height="12" rx="2" width="18" x="3" y="6" />
        <path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" />
      </Glyph>
    ),
  },
  {
    title: "Light and dark",
    description:
      "Colors come from your theme tokens, so every component follows light and dark mode without extra code.",
    icon: (
      <Glyph>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" />
      </Glyph>
    ),
  },
  {
    title: "Calm motion",
    description:
      "Number Ticker and Command Search hold still when a visitor turns on reduced motion.",
    icon: (
      <Glyph>
        <path d="M3 12h3l2.5-6 4 12 2.5-6H21" />
      </Glyph>
    ),
  },
];

/** The template's security section, retold as what every component ships with. */
export function QualitySection() {
  return (
    <section className="py-20 md:py-28" id="quality">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            badge="Quality"
            lines={[
              { text: "Built to ship," },
              { text: "not just to demo.", muted: true },
            ]}
          />
          <p className="max-w-sm text-base text-body leading-[1.45] lg:pb-1.5">
            The same care goes into every component: typed source, accessible
            markup, and both themes from the first install.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {POINTS.map((point, index) => (
            <li key={point.title}>
              <Reveal className="h-full" delay={index * 100}>
                <div className="flex h-full flex-col gap-10 rounded-2xl border border-border bg-(--surface) p-6">
                  <span className="flex size-10 items-center justify-center rounded-[10px] border border-border bg-background text-foreground">
                    {point.icon}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl tracking-[-0.02em]">
                      {point.title}
                    </h3>
                    <p className="text-body text-sm leading-[1.5]">
                      {point.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
