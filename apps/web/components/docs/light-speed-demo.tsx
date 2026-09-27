"use client";

import type { LightSpeedProps } from "@bklitui/ui/components/light-speed";
import dynamic from "next/dynamic";

import { usePauseWhenOffscreen } from "@/lib/use-pause-when-offscreen";

// three.js is large and needs WebGL, so it loads in the browser after the page.
const LightSpeed = dynamic(
  () =>
    import("@bklitui/ui/components/light-speed").then((mod) => mod.LightSpeed),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#05070b]" />,
  },
);

export function LightSpeedDemo(
  props: Omit<LightSpeedProps, "className" | "paused">,
) {
  // Each preview is its own WebGL canvas; stop drawing the ones out of view.
  const { ref, paused } = usePauseWhenOffscreen();

  return (
    <div
      className="relative isolate flex h-[420px] w-full items-center justify-center overflow-hidden rounded-lg max-sm:h-72"
      ref={ref}
    >
      <LightSpeed {...props} paused={paused} />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="font-mono text-white/60 text-xs uppercase tracking-[0.2em]">
          Backgrounds
        </span>
        <p className="text-balance font-medium text-3xl text-white tracking-tight sm:text-4xl">
          Ship at light speed
        </p>
      </div>
    </div>
  );
}
