"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";

import { Index } from "@/registry/__index__";
import { cn } from "@/lib/utils";

import { LazyMount } from "./lazy-mount";

function TabButton({
  active,
  children,
  ...props
}: React.ComponentProps<"button"> & { active: boolean }) {
  return (
    <button
      type="button"
      data-active={active}
      className={cn(
        "rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        active && "bg-accent text-foreground",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function ComponentPreviewTabs({
  name,
  codeBlock,
  className,
}: {
  name: string;
  codeBlock: React.ReactNode;
  className?: string;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const [reloadKey, setReloadKey] = React.useState(0);
  const Component = Index[name]?.component;

  return (
    <div
      className={cn(
        "not-prose group relative mt-4 mb-6 rounded-[10px] bg-[#F5F5F5] p-1 dark:bg-primary-foreground",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <TabButton
            active={tab === "preview"}
            onClick={() => setTab("preview")}
          >
            Preview
          </TabButton>
          <TabButton active={tab === "code"} onClick={() => setTab("code")}>
            Code
          </TabButton>
        </div>
        {tab === "preview" && (
          <button
            type="button"
            aria-label="Reload preview"
            onClick={() => setReloadKey((k) => k + 1)}
            className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <RotateCw
              className="size-3.5 transition-transform duration-500"
              style={{ transform: `rotate(${reloadKey * -360}deg)` }}
            />
          </button>
        )}
      </div>

      {tab === "preview" ? (
        <div className="flex min-h-[22.5rem] w-full items-center justify-center overflow-hidden rounded-md border bg-background p-10">
          <LazyMount className="flex w-full items-center justify-center">
            {Component ? (
              <React.Suspense
                fallback={
                  <span className="text-sm text-muted-foreground">
                    Loading…
                  </span>
                }
              >
                <div
                  key={reloadKey}
                  className="flex w-full items-center justify-center"
                >
                  <Component />
                </div>
              </React.Suspense>
            ) : (
              <p className="text-sm text-muted-foreground">
                Unknown preview: <code>{name}</code>
              </p>
            )}
          </LazyMount>
        </div>
      ) : (
        <div className="no-scrollbar max-h-[31.25rem] overflow-auto rounded-md border bg-background">
          {codeBlock}
        </div>
      )}
    </div>
  );
}
