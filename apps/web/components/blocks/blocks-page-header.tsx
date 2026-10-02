import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Plain title and intro at the top of the blocks pages. */
export function BlocksPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col items-start gap-4 pt-10 md:gap-5 md:pt-16",
        className,
      )}
    >
      <h1 className="text-balance font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h1>
      <p className="max-w-3xl text-pretty text-lg text-muted-foreground leading-relaxed md:text-xl">
        {description}
      </p>
      {action}
    </header>
  );
}
