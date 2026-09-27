import { ArrowUpRightIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ArrowLink({
  href,
  children,
  className,
  inverted = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** Light link for dark backgrounds. */
  inverted?: boolean;
}) {
  const external = href.startsWith("http");

  return (
    <a
      className={cn(
        "group inline-flex items-center gap-3 font-medium text-lg",
        className,
      )}
      href={href}
      {...(external ? { rel: "noopener", target: "_blank" } : {})}
    >
      <span>{children}</span>
      <span
        className={cn(
          "relative flex size-10 items-center justify-center overflow-hidden rounded-full border",
          inverted ? "border-background" : "border-foreground",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100",
            inverted ? "bg-background" : "bg-foreground",
          )}
        />
        <ArrowUpRightIcon
          className={cn(
            "relative size-4 transition-[color,transform] duration-300 group-hover:rotate-45",
            inverted
              ? "group-hover:text-foreground"
              : "group-hover:text-background",
          )}
        />
      </span>
    </a>
  );
}
