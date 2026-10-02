"use client";

import { FeatureBentoGrid } from "@/components/feature-bento-grid";

export default function Component() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <FeatureBentoGrid />
      </div>
    </main>
  );
}
