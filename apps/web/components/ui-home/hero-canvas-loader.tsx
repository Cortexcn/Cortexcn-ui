"use client";

import dynamic from "next/dynamic";

// Twenty live demos are heavy, so the canvas loads in the browser after the
// hero's text has painted.
const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export function HeroCanvasLoader({ className }: { className?: string }) {
  return <HeroCanvas className={className} />;
}
