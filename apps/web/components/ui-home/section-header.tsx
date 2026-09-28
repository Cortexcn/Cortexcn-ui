import { cn } from "@/lib/utils";

import { SectionBadge } from "./primitives";
import { type HeadingLine, RevealHeading } from "./reveal";

/**
 * The opening of every section below the hero: a dot badge and a two-tone
 * heading whose words rise in once it scrolls into view.
 */
export function SectionHeader({
  badge,
  lines,
  className,
}: {
  badge: string;
  /** Usually two lines: a plain statement, then its quiet half. */
  lines: HeadingLine[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-5", className)}>
      <SectionBadge>{badge}</SectionBadge>
      <RevealHeading
        className="max-w-3xl font-light font-sentient text-[38px] leading-[1.05] tracking-[-0.05em] md:text-[40px] lg:text-[48px]"
        lines={lines}
      />
    </div>
  );
}
