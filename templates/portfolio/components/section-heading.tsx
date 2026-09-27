import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
        {label}
      </p>
      <h2 className="font-semibold text-5xl tracking-tight md:text-7xl">
        {children}
      </h2>
    </div>
  );
}
