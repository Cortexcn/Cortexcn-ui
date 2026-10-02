"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

import { LoaderDotMatrix } from "./loader-dot-matrix";

const EXAMPLES: { label: string; loader: ReactNode }[] = [
  { label: "Ripple (default)", loader: <LoaderDotMatrix /> },
  { label: "Wave", loader: <LoaderDotMatrix pattern="wave" /> },
  {
    label: "Rain, 6 by 6",
    loader: <LoaderDotMatrix cols={6} pattern="rain" rows={6} />,
  },
  {
    label: "In a button",
    loader: (
      <Button className="gap-2" disabled variant="outline">
        <LoaderDotMatrix cols={3} dotSize={2} rows={3} speed={1.2} />
        Saving
      </Button>
    ),
  },
];

/** The dot matrix loader four ways: its default, two other patterns, and in a button. */
export function LoaderDotMatrixDemo() {
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
