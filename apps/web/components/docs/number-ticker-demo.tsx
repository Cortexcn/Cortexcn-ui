"use client";

import {
  NumberTicker,
  type NumberTickerProps,
} from "@bklitui/ui/components/number-ticker";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const VALUES = [12_480, 3905, 87_215, 640, 25_300];

export function NumberTickerDemo(
  props: Omit<NumberTickerProps, "className" | "value">,
) {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col items-center gap-6">
      <NumberTicker
        blur
        className="font-semibold text-5xl tracking-tight sm:text-6xl"
        locale
        prefix="$"
        {...props}
        value={VALUES[index] ?? 0}
      />
      <Button
        onClick={() => setIndex((current) => (current + 1) % VALUES.length)}
        size="sm"
        variant="outline"
      >
        Change the value
      </Button>
    </div>
  );
}
