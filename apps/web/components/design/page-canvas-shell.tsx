import type { ReactNode } from "react";

export function PageCanvasShell({ children }: { children: ReactNode }) {
  return <div className="relative w-full px-4 sm:px-0">{children}</div>;
}
