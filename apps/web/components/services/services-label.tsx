import { cn } from "@/lib/utils";

/** "> LABEL ————" row that opens each section of the services page. */
export function ServicesLabel({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-medium font-mono text-sm uppercase leading-[1.3] tracking-[-0.04em]",
        className,
      )}
    >
      <span className="shrink-0 text-label-strong">&gt; {label}</span>
      <span aria-hidden="true" className="ml-2 h-px min-w-6 flex-1 bg-border" />
    </div>
  );
}
