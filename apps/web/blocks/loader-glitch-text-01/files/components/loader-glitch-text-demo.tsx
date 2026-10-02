"use client";

import type { ReactNode } from "react";

import { LoaderGlitchText } from "./loader-glitch-text";

const EXAMPLES: { label: string; loader: ReactNode }[] = [
  { label: "Medium (default)", loader: <LoaderGlitchText /> },
  {
    label: "Subtle",
    loader: <LoaderGlitchText intensity="subtle" text="SYNCING" />,
  },
  {
    label: "Heavy",
    loader: <LoaderGlitchText intensity="heavy" text="DECRYPTING" />,
  },
  {
    label: "As a heading",
    loader: (
      <LoaderGlitchText
        className="font-bold text-3xl tracking-tight"
        text="BOOTING UP"
      />
    ),
  },
];

/** The glitch text loader four ways: its default, softer, harder, and large. */
export function LoaderGlitchTextDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
      {EXAMPLES.map((example) => (
        <figure
          className="flex aspect-4/3 flex-col items-center justify-center gap-6 rounded-xl border bg-background p-6"
          key={example.label}
        >
          <div className="flex flex-1 items-center">{example.loader}</div>
          <figcaption className="font-mono text-muted-foreground text-xs">
            {example.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
