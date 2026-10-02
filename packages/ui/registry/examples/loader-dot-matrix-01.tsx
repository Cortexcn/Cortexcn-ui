"use client";

import { LoaderDotMatrixDemo } from "@/components/loader-dot-matrix-demo";

export default function Component() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <LoaderDotMatrixDemo />
      </div>
    </main>
  );
}
