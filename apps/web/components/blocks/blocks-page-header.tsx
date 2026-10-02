import type { ReactNode } from "react";

/** Plain title and intro at the top of the blocks pages. */
export function BlocksPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col items-start gap-4 pt-10 md:gap-5 md:pt-16">
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
