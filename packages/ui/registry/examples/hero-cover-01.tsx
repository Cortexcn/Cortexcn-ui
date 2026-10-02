"use client";

import { HeroCover } from "@/components/hero-cover";

export default function Component() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-7xl">
        <HeroCover />
      </div>
    </main>
  );
}
