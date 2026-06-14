"use client";

import * as React from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

import { Index } from "@/registry/__index__";

export function ComponentPreviewTabs({
  name,
  code,
}: {
  name: string;
  code: string;
}) {
  const Component = Index[name]?.component;

  return (
    <Tabs items={["Preview", "Code"]} className="not-prose">
      <Tab value="Preview">
        <div className="flex min-h-60 items-center justify-center rounded-lg border border-line p-10">
          <React.Suspense
            fallback={
              <span className="text-sm text-fd-muted-foreground">Loading…</span>
            }
          >
            {Component ? <Component /> : null}
          </React.Suspense>
        </div>
      </Tab>
      <Tab value="Code">
        <DynamicCodeBlock lang="tsx" code={code} />
      </Tab>
    </Tabs>
  );
}
