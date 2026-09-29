"use client";

// Examples adapted from the shadcn/ui Collapsible docs (MIT, https://ui.shadcn.com).

import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/collapsible";
import { Field, FieldGroup, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";

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

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

export function CollapsibleFileTree() {
  const fileTree: FileTreeItem[] = [
    {
      name: "components",
      items: [
        {
          name: "ui",
          items: [
            { name: "button.tsx" },
            { name: "card.tsx" },
            { name: "dialog.tsx" },
            { name: "input.tsx" },
            { name: "select.tsx" },
            { name: "table.tsx" },
          ],
        },
        { name: "login-form.tsx" },
        { name: "register-form.tsx" },
      ],
    },
    {
      name: "lib",
      items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
    },
    {
      name: "hooks",
      items: [
        { name: "use-media-query.ts" },
        { name: "use-debounce.ts" },
        { name: "use-local-storage.ts" },
      ],
    },
    {
      name: "types",
      items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
    },
    {
      name: "public",
      items: [
        { name: "favicon.ico" },
        { name: "logo.svg" },
        { name: "images" },
      ],
    },
    { name: "app.tsx" },
    { name: "layout.tsx" },
    { name: "globals.css" },
    { name: "package.json" },
    { name: "tsconfig.json" },
    { name: "README.md" },
    { name: ".gitignore" },
  ];

  const renderItem = (fileItem: FileTreeItem) => {
    if ("items" in fileItem) {
      return (
        <Collapsible key={fileItem.name}>
          <CollapsibleTrigger asChild>
            <Button
              className="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
              size="sm"
              variant="ghost"
            >
              <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
              <FolderIcon />
              {fileItem.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 ml-5 style-lyra:ml-4">
            <div className="flex flex-col gap-1">
              {fileItem.items.map((child) => renderItem(child))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <Button
        className="w-full justify-start gap-2 text-foreground"
        key={fileItem.name}
        size="sm"
        variant="link"
      >
        <FileIcon />
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <Example className="items-center" title="File Tree">
      <Card className="mx-auto w-full max-w-[16rem] gap-2" size="sm">
        <CardHeader>
          <Tabs defaultValue="explorer">
            <TabsList className="w-full">
              <TabsTrigger value="explorer">Explorer</TabsTrigger>
              <TabsTrigger value="settings">Outline</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            {fileTree.map((item) => renderItem(item))}
          </div>
        </CardContent>
      </Card>
    </Example>
  );
}

export function CollapsibleSettings() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Example className="items-center" title="Settings">
      <Card className="mx-auto w-full max-w-xs" size="sm">
        <CardHeader>
          <CardTitle>Radius</CardTitle>
          <CardDescription>
            Set the corner radius of the element.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible
            className="flex items-start gap-2"
            onOpenChange={setIsOpen}
            open={isOpen}
          >
            <FieldGroup className="grid w-full grid-cols-2 gap-2">
              <Field>
                <FieldLabel className="sr-only" htmlFor="radius-x">
                  Radius X
                </FieldLabel>
                <Input defaultValue={0} id="radius" placeholder="0" />
              </Field>
              <Field>
                <FieldLabel className="sr-only" htmlFor="radius-y">
                  Radius Y
                </FieldLabel>
                <Input defaultValue={0} id="radius" placeholder="0" />
              </Field>
              <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-2">
                <Field>
                  <FieldLabel className="sr-only" htmlFor="radius-x">
                    Radius X
                  </FieldLabel>
                  <Input defaultValue={0} id="radius" placeholder="0" />
                </Field>
                <Field>
                  <FieldLabel className="sr-only" htmlFor="radius-y">
                    Radius Y
                  </FieldLabel>
                  <Input defaultValue={0} id="radius" placeholder="0" />
                </Field>
              </CollapsibleContent>
            </FieldGroup>
            <CollapsibleTrigger asChild>
              <Button size="icon" variant="outline">
                {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </CardContent>
      </Card>
    </Example>
  );
}
