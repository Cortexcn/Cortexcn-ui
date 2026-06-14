import * as React from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Step, Steps } from "fumadocs-ui/components/steps";
import {
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";

import { cn } from "@/lib/utils";
import { stripCodeAnnotations } from "@/lib/highlight-code";
import { ComponentPreview } from "@/components/docs/component-preview";
import { ComponentSource } from "@/components/docs/component-source";
import { ComponentsOverview } from "@/components/docs/components-overview";
import { BlocksOverview } from "@/components/docs/blocks-overview";
import { ComingSoon } from "@/components/docs/coming-soon";
import { CodeBlock } from "@/components/docs/mdx/code-block";
import CopyButton from "@/components/docs/mdx/copy-button";
import {
  A,
  Blockquote,
  Description,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Hr,
  Kbd,
  Li,
  Ol,
  P,
  Strong,
  Table,
  Td,
  Th,
  Tr,
  Ul,
} from "@/components/docs/mdx/prose";

// Wraps rehype-pretty-code's <pre> in the framed card used across the docs.
function Pre({ className, children, ...props }: React.ComponentProps<"pre">) {
  return (
    <div className="group relative mt-4 rounded-[8px] bg-[#F5F5F5] p-1 dark:bg-primary-foreground">
      <pre
        className={cn(
          "no-scrollbar min-w-0 overflow-x-auto rounded-sm border bg-background py-3.5 text-[.8125rem] outline-none has-data-[line-numbers]:px-0 [&>code]:px-0!",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

type CodeProps = React.ComponentProps<"code"> & {
  __raw__?: string;
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
};

// Inline code → bordered chip; fenced code → adds the hover copy button.
function Code({
  className,
  __raw__,
  __npm__: _npm,
  __yarn__: _yarn,
  __pnpm__: _pnpm,
  __bun__: _bun,
  ...props
}: CodeProps) {
  if (typeof props.children === "string") {
    return (
      <code
        className={cn(
          "relative mx-0.5 rounded-md border bg-background px-[0.3rem] py-[2px] font-mono text-[0.8em] text-(--color-vesper-type)",
          className,
        )}
        {...props}
      />
    );
  }

  const cleanedCode = __raw__ ? stripCodeAnnotations(__raw__) : "";
  const isSingleLine = cleanedCode
    ? cleanedCode.split("\n").length === 1
    : false;

  return (
    <>
      {cleanedCode && (
        <CopyButton
          withBlurBg
          code={cleanedCode}
          className={cn(
            "absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100",
            isSingleLine && "top-4",
          )}
        />
      )}
      <code className={className} {...props} />
    </>
  );
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    h5: H5,
    h6: H6,
    p: P,
    strong: Strong,
    a: A,
    ul: Ul,
    ol: Ol,
    li: Li,
    blockquote: Blockquote,
    hr: Hr,
    kbd: Kbd,
    table: Table,
    tr: Tr,
    th: Th,
    td: Td,
    pre: Pre,
    code: Code,
    Tabs,
    Tab,
    TabsList,
    TabsTrigger,
    TabsContent,
    Steps,
    Step,
    Description,
    CodeBlock,
    ComponentPreview,
    ComponentSource,
    ComponentsOverview,
    BlocksOverview,
    ComingSoon,
    ...components,
  };
}
