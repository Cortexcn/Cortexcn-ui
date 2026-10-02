"use client";

import { GooeyNav } from "@bklitui/ui/components/gooey-nav";

const ITEMS = [
  { label: "Home", href: "#" },
  { label: "Components", href: "#" },
  { label: "Blocks", href: "#" },
  { label: "Charts", href: "#" },
  { label: "Changelog", href: "#" },
];

export function GooeyNavDemo() {
  return (
    <div className="flex min-h-40 w-full min-w-0 items-center justify-center">
      <GooeyNav items={ITEMS} />
    </div>
  );
}

export function GooeyNavCompactDemo() {
  return (
    <div className="flex min-h-40 w-full min-w-0 items-center justify-center">
      <GooeyNav
        defaultIndex={1}
        drops={4}
        duration={420}
        items={ITEMS.slice(0, 3)}
      />
    </div>
  );
}
