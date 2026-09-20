import type * as React from "react";

import { Container, Section, SectionHeading } from "./primitives";

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

function ServerIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <rect height="8" rx="1.5" width="18" x="3" y="3" />
      <rect height="8" rx="1.5" width="18" x="3" y="13" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="8" cy="14" r="4" />
      <path d="m10.8 11.2 8.9-8.9M17 4l2 2M14 7l2 2" />
    </svg>
  );
}

const points: {
  title: string;
  body: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}[] = [
  {
    title: "Open source components",
    body: "Every component is yours to read, edit, and keep. No lock-in.",
    icon: ShieldIcon,
  },
  {
    title: "Self-host or cloud",
    body: "Run the MCP server locally or in your own environment.",
    icon: ServerIcon,
  },
  {
    title: "Your keys, your data",
    body: "Cortexcn does not sit between your agent and your code.",
    icon: KeyIcon,
  },
];

export function TrustSection() {
  return (
    <Section id="trust">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <SectionHeading
            align="start"
            description="Cortexcn is built on open standards and code you own."
            eyebrow="Open by default"
            title="Your code, your control"
          />

          <ul className="flex flex-col gap-8">
            {points.map((point) => (
              <li className="flex items-start gap-4" key={point.title}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-foreground/20 bg-foreground/10 text-foreground dark:text-foreground">
                  <point.icon className="size-5" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">{point.title}</p>
                  <p className="text-muted-foreground text-sm">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
