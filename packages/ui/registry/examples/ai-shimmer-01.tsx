"use client";

import { ThinkingMessage } from "@/components/thinking-message";

export default function Component() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ThinkingMessage />
      </div>
    </main>
  );
}
