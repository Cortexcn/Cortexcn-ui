"use client";

import { SphereMenu } from "@bklitui/ui/components/sphere-menu";

/** Sample photos from Unsplash (free to use under the Unsplash License). */
const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=480&h=480&fit=crop&q=75&auto=format`;

const ITEMS = [
  {
    image: photo("1782977389500-dd7adad33ebe"),
    title: "Components",
    description: "Buttons, dialogs, motion, and more.",
    href: "/docs/components",
  },
  {
    image: photo("1781499455083-6ccc3beb20cd"),
    title: "Blocks",
    description: "Heroes, features, loaders, and AI sections.",
    href: "/blocks",
  },
  {
    image: photo("1776394254711-4a0d7345269a"),
    title: "Charts",
    description: "Animated, themed charts you can compose.",
    href: "/charts/area-chart",
  },
  {
    image: photo("1781242629922-6f39cc3671cd"),
    title: "Templates",
    description: "Complete websites to start from.",
    href: "/templates",
  },
];

export function SphereMenuDemo() {
  return <SphereMenu items={ITEMS} />;
}

export function SphereMenuDenseDemo() {
  return (
    <SphereMenu className="h-[520px]" items={ITEMS} scale={1.15} tiles={64} />
  );
}
