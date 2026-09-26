"use client";

import { LineNav, type LineNavItem } from "@bklitui/ui/components/line-nav";
import { useState } from "react";

const ITEMS: LineNavItem[] = [
  { title: "Introduction", href: "#introduction" },
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "API Reference", href: "#api-reference" },
];

export function LineNavDemo() {
  const [activeHref, setActiveHref] = useState(ITEMS[0]?.href);

  return (
    <LineNav
      activeHref={activeHref}
      items={ITEMS}
      onItemClick={(item, event) => {
        // Demo only: stay on the docs page instead of jumping to the anchor.
        event.preventDefault();
        setActiveHref(item.href);
      }}
      scrollActiveIntoView={false}
    />
  );
}
