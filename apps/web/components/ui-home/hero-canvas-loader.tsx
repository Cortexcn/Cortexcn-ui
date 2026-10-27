"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Twenty live demos are heavy, so the canvas loads in the browser after the
// hero's text has painted.
const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export function HeroCanvasLoader({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <HeroCanvas className="absolute inset-0" />
    </div>
  );
}
