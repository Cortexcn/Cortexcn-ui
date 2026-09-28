import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Lays its children out at a fixed desktop width, then scales them down to
 * the width of the frame, like a screenshot that stays live. CSS cannot divide
 * one length by another, but tan(atan2(a, b)) equals a / b, so the browser
 * works out the scale from the frame's width. It is right in the server HTML,
 * before hydration, and without JavaScript.
 */
export function ScaledPreview({
  designWidth,
  className,
  children,
}: {
  /** Width the content is laid out at, in pixels. */
  designWidth: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("@container relative overflow-hidden", className)}>
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: designWidth,
          transform: `scale(tan(atan2(100cqw, ${designWidth}px)))`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
