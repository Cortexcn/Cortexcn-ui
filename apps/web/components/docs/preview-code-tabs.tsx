"use client";

import type { ReactNode } from "react";
import { ShowcaseCodeBlock } from "@/components/docs/showcase-code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Preview / Code tabs for a docs hero preview (shadcn docs pattern). */
export function PreviewCodeTabs({
  preview,
  code,
  lang = "tsx",
}: {
  preview: ReactNode;
  code: string;
  lang?: string;
}) {
  return (
    <Tabs defaultValue="preview">
      <TabsList className="mb-3" variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">{preview}</TabsContent>
      <TabsContent value="code">
        <div className="max-h-[480px] overflow-auto rounded-xl border border-border bg-card shadow-sm [&_figure]:my-0! [&_figure]:rounded-none! [&_figure]:border-0! [&_pre]:my-0!">
          <ShowcaseCodeBlock code={code} lang={lang} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
