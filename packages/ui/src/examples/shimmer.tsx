"use client";

import { Shimmer } from "../components/shimmer";

export function ShimmerDemo() {
  return <Shimmer className="text-lg">Generating your dashboard...</Shimmer>;
}

export function ShimmerHeading() {
  return (
    <Shimmer as="h3" className="font-semibold text-2xl" duration={3}>
      Searching 135 components
    </Shimmer>
  );
}

export function ShimmerInMessage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="self-end rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground text-sm">
        Can you add a pricing table to the landing page?
      </div>
      <div className="self-start rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm">
        <Shimmer as="span" duration={1.5} spread={3}>
          Reading the landing page...
        </Shimmer>
      </div>
    </div>
  );
}
