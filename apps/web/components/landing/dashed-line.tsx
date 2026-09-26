import { cn } from "@/lib/utils";

/**
 * Animated dashed rule used to frame landing sections. Vertical lines sit on
 * the Container edges, so consecutive sections read as one continuous frame.
 */
export function DashedLine({
  orientation,
  className,
}: {
  orientation: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute motion-reduce:animate-none",
        orientation === "vertical"
          ? "inset-y-0 w-px animate-dash-scroll bg-[linear-gradient(to_bottom,var(--border)_66%,transparent_0)] bg-size-[1px_18px]"
          : "inset-x-0 h-px animate-dash-scroll-x bg-[linear-gradient(to_right,var(--border)_66%,transparent_0)] bg-size-[18px_1px]",
        className,
      )}
    />
  );
}

/** Small square that caps the point where two frame lines meet. */
export function FrameCorner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-1 size-2 border border-border bg-background",
        className,
      )}
    />
  );
}
