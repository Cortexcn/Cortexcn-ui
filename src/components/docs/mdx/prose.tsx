import * as React from "react";
import { LinkIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* Headings — Geist (font-sans). IDs come from Fumadocs' auto-slug so the
   table-of-contents anchors stay in sync; H2/H3 get a hover anchor link. */

export function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-3xl font-bold tracking-tight text-foreground select-none",
        className,
      )}
      {...props}
    />
  );
}

function AnchoredHeading({
  as: Tag,
  className,
  id,
  children,
  ...props
}: React.ComponentProps<"h2"> & { as: "h2" | "h3" }) {
  return (
    <Tag
      id={id}
      className={cn(
        "group scroll-m-20 font-medium tracking-tight text-primary select-none",
        Tag === "h2" ? "mt-10 text-xl first:mt-0" : "mt-8 text-base",
        className,
      )}
      {...props}
    >
      {id ? (
        <a href={`#${id}`} className="relative no-underline">
          <LinkIcon className="absolute top-1.5 -left-5 hidden size-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:block" />
          {children}
        </a>
      ) : (
        children
      )}
    </Tag>
  );
}

export function H2(props: React.ComponentProps<"h2">) {
  return <AnchoredHeading as="h2" {...props} />;
}

export function H3(props: React.ComponentProps<"h3">) {
  return <AnchoredHeading as="h3" {...props} />;
}

export function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-base font-medium tracking-tight text-primary select-none",
        className,
      )}
      {...props}
    />
  );
}

export function H5({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-base font-medium tracking-tight text-primary select-none",
        className,
      )}
      {...props}
    />
  );
}

export function H6({ className, ...props }: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-medium tracking-tight text-primary select-none",
        className,
      )}
      {...props}
    />
  );
}

/* Body text */

export function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-inter leading-7 text-muted-foreground [&:not(:first-child)]:mt-5",
        className,
      )}
      {...props}
    />
  );
}

export function Strong({
  className,
  ...props
}: React.ComponentProps<"strong">) {
  return (
    <strong
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function Description({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

/* Links */

export function A({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "font-medium text-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:decoration-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* Lists */

export function Ul({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn(
        "my-5 ml-5 list-disc text-muted-foreground [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

export function Ol({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      className={cn(
        "my-5 ml-5 list-decimal text-muted-foreground [&>li]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

export function Li({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("leading-7", className)} {...props} />;
}

/* Block elements */

export function Blockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-border pl-6 text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  );
}

export function Hr({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr className={cn("my-8 border-border", className)} {...props} />;
}

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[0.7rem] font-medium text-muted-foreground select-none",
        className,
      )}
      {...props}
    />
  );
}

/* Tables */

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="no-scrollbar my-6 w-full overflow-x-auto">
      <table
        className={cn("w-full border-collapse text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function Tr({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "px-4 py-2 text-left font-medium text-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-4 py-2 text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  );
}
