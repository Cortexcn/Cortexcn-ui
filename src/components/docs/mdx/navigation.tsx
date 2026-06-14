import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function MDXNavigation({
  type,
  title,
  url,
  description,
}: {
  type: "previous" | "next";
  title: ReactNode;
  url: string;
  description?: ReactNode;
}) {
  return (
    <Link href={url} className="block h-full">
      <div
        className={cn(
          "group flex h-full cursor-pointer rounded-md bg-[#F5F5F5] p-[2px] text-muted-foreground dark:bg-primary-foreground",
          type === "previous" ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div className="flex flex-1 flex-col gap-0.5 rounded-md border bg-background p-3 duration-200 group-hover:border-primary/20">
          <span className="line-clamp-1 text-[13px] capitalize duration-200 group-hover:text-primary">
            {title}
          </span>
          {description ? (
            <span className="line-clamp-1 text-xs text-muted-foreground/70">
              {description}
            </span>
          ) : null}
        </div>
        <div className="flex items-center duration-200 group-hover:text-primary sm:px-2">
          {type === "previous" ? (
            <ChevronLeft strokeWidth={1.5} className="size-5" />
          ) : (
            <ChevronRight strokeWidth={1.5} className="size-5" />
          )}
        </div>
      </div>
    </Link>
  );
}
