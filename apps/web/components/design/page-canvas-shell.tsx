import type { ReactNode } from "react";

export function PageCanvasShell({ children }: { children: ReactNode }) {
  return (
    // Clip, not hide: the hero grid's corner marks sit past the page edge and
    // would add a sideways scroll, while sticky children keep working.
    <div className="relative w-full overflow-x-clip px-4 sm:px-0">
      {children}
    </div>
  );
}
