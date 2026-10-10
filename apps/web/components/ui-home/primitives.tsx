import Link from "next/link";
import type * as React from "react";

import { cn } from "@/lib/utils";

/** Page-width wrapper: 1200px of content with 24px gutters. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1248px] px-6", className)}
      {...props}
    />
  );
}

/** Small "dot and label" tag that opens each section. */
export function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[15px] text-muted-foreground">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

/** Label that slides up on hover, revealing an identical copy from below. */
function RollingLabel({ children }: { children: string }) {
  const lineClassName =
    "block transition-transform duration-500 ease-(--ui-ease) group-hover:-translate-y-full motion-reduce:transition-none";

  return (
    <span className="relative block overflow-hidden">
      <span className={lineClassName}>{children}</span>
      <span
        aria-hidden="true"
        className={cn(lineClassName, "absolute inset-x-0 top-full")}
      >
        {children}
      </span>
    </span>
  );
}

const buttonBaseClassName =
  "group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] px-5 font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** The dark, filled call to action. */
export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        buttonBaseClassName,
        "bg-primary text-primary-foreground hover:bg-primary/90",
        className,
      )}
      href={href}
    >
      <RollingLabel>{children}</RollingLabel>
    </Link>
  );
}

/** The quiet, outlined call to action that sits next to a primary one. */
export function SecondaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: string;
  className?: string;
}) {
  return (
    <Link
      className={cn(
        buttonBaseClassName,
        "border border-border bg-background text-foreground hover:bg-muted",
        className,
      )}
      href={href}
    >
      <RollingLabel>{children}</RollingLabel>
    </Link>
  );
}

/** `SecondaryLink` as a real button, for actions such as signing out. */
export function SecondaryButton({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "children"> & { children: string }) {
  return (
    <button
      className={cn(
        buttonBaseClassName,
        "border border-border bg-background text-foreground hover:bg-muted disabled:cursor-wait disabled:opacity-60",
        className,
      )}
      type="button"
      {...props}
    >
      <RollingLabel>{children}</RollingLabel>
    </button>
  );
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
