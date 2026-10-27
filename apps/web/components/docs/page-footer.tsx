"use client";

import { Icon } from "@cortexcn/icons";
import Link from "next/link";
import type { ReactNode } from "react";

interface PageFooterProps {
  previous?: {
    name: ReactNode;
    url: string;
  } | null;
  next?: {
    name: ReactNode;
    url: string;
  } | null;
}

export function PageFooter({ previous, next }: PageFooterProps) {
  if (!(previous || next)) {
    return null;
  }

  return (
    <footer className="mt-14 grid grid-cols-2 gap-4">
      {previous ? (
        <Link
          className="group flex items-center gap-3 rounded-shell-lg border border-border bg-card px-4 py-3.5 text-muted-foreground no-underline shadow-xs outline-none transition-[border-color,box-shadow] hover:border-foreground/20 hover:text-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50"
          href={previous.url}
        >
          <Icon className="size-4" name="IconChevronLeft" />
          <div className="flex flex-col">
            <span className="text-xs">Previous</span>
            <span className="font-medium text-foreground text-sm">
              {previous.name}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          className="group col-start-2 flex items-center justify-end gap-3 rounded-shell-lg border border-border bg-card px-4 py-3.5 text-right text-muted-foreground no-underline shadow-xs outline-none transition-[border-color,box-shadow] hover:border-foreground/20 hover:text-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50"
          href={next.url}
        >
          <div className="flex flex-col">
            <span className="text-xs">Next</span>
            <span className="font-medium text-foreground text-sm">
              {next.name}
            </span>
          </div>
          <Icon className="size-4" name="IconChevronRight" />
        </Link>
      ) : (
        <div />
      )}
    </footer>
  );
}
