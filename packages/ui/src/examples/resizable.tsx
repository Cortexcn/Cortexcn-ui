"use client";

// Examples adapted from the shadcn/ui Resizable docs (MIT, https://ui.shadcn.com).

import * as React from "react";
import type { Layout } from "react-resizable-panels";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/resizable";

/** Stands in for the shadcn docs frame; the docs page draws its own. */
function Example({
  className,
  children,
}: React.ComponentProps<"div"> & {
  title?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-6 *:[div:not([class*='w-'])]:w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ResizableHorizontal() {
  return (
    <Example title="Horizontal">
      <ResizablePanelGroup
        className="min-h-[200px] rounded-lg style-lyra:rounded-none style-sera:rounded-none border"
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="25%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="75%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  );
}

export function ResizableVertical() {
  return (
    <Example title="Vertical">
      <ResizablePanelGroup
        className="min-h-[200px] rounded-lg style-lyra:rounded-none style-sera:rounded-none border"
        orientation="vertical"
      >
        <ResizablePanel defaultSize="25%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="75%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  );
}

export function ResizableWithHandle() {
  return (
    <Example title="With Handle">
      <ResizablePanelGroup
        className="min-h-[200px] rounded-lg style-lyra:rounded-none style-sera:rounded-none border"
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="25%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="75%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  );
}

export function ResizableNested() {
  return (
    <Example title="Nested">
      <ResizablePanelGroup
        className="rounded-lg style-lyra:rounded-none style-sera:rounded-none border"
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="50%">
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="25%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize="75%">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  );
}

export function ResizableControlled() {
  const [layout, setLayout] = React.useState<Layout>({});

  return (
    <Example title="Controlled">
      <ResizablePanelGroup
        className="min-h-[200px] rounded-lg style-lyra:rounded-none style-sera:rounded-none border"
        onLayoutChange={setLayout}
        orientation="horizontal"
      >
        <ResizablePanel defaultSize="30%" id="left" minSize="20%">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">
              {Math.round(layout.left ?? 30)}%
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="70%" id="right" minSize="30%">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">
              {Math.round(layout.right ?? 70)}%
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  );
}
