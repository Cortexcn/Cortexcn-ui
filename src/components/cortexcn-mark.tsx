import { cn } from "@/lib/utils";

export function CortexcnMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-xl font-black tracking-tight lowercase",
        className,
      )}
    >
      cortexcn
    </span>
  );
}
