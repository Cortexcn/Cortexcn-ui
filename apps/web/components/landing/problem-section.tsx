import type * as React from "react";

import { Container, Section, SectionHeading, Surface } from "./primitives";

const problems: {
  title: string;
  body: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "Hallucinated components",
    body: "Your agent writes UI from memory. The markup looks close, but the details are wrong.",
    icon: (
      <svg
        aria-hidden
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78a1.5 1.5 0 0 0 1.29-2.25L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M12 9v4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M12 16.5h.01"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Inconsistent design",
    body: "Spacing, states, and tokens drift on every prompt, so nothing matches.",
    icon: (
      <svg
        aria-hidden
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m12 2 9 5-9 5-9-5 9-5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="m3 12 9 5 9-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="m3 17 9 5 9-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    title: "Hours of rework",
    body: "You spend the time you saved fixing what the agent got wrong.",
    icon: (
      <svg
        aria-hidden
        fill="none"
        height="20"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7v5l3.5 2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <Container>
        <SectionHeading
          align="center"
          description="Coding agents are good at logic and bad at interfaces. Left alone, they invent components, break your layout, and leave you cleaning up."
          eyebrow="The problem"
          title="AI agents guess at UI"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <Surface className="p-6" key={problem.title}>
              <div className="flex size-10 items-center justify-center rounded-[10px] border border-border text-muted-foreground">
                {problem.icon}
              </div>
              <h3 className="mt-5 font-medium text-foreground">
                {problem.title}
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                {problem.body}
              </p>
            </Surface>
          ))}
        </div>
      </Container>
    </Section>
  );
}
