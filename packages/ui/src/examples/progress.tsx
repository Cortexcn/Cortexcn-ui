"use client";

// Examples adapted from the shadcn/ui Progress docs (MIT, https://ui.shadcn.com).

import { FileIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "../components/field";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "../components/item";
import { Progress } from "../components/progress";
import { Slider } from "../components/slider";

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

export function ProgressValues() {
  return (
    <Example title="Progress Bar">
      <div className="flex w-full flex-col gap-4">
        <Progress value={0} />
        <Progress className="w-full" value={25} />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </div>
    </Example>
  );
}

export function ProgressWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="progress-upload">
          <span>Upload progress</span>
          <span className="ml-auto">66%</span>
        </FieldLabel>
        <Progress className="w-full" id="progress-upload" value={66} />
      </Field>
    </Example>
  );
}

export function ProgressControlled() {
  const [value, setValue] = React.useState([50]);

  return (
    <Example title="Controlled">
      <div className="flex w-full flex-col gap-4">
        <Progress className="w-full" value={value[0]} />
        <Slider
          max={100}
          min={0}
          onValueChange={setValue}
          step={1}
          value={value}
        />
      </div>
    </Example>
  );
}

export function FileUploadList() {
  const files = React.useMemo(
    () => [
      {
        id: "1",
        name: "document.pdf",
        progress: 45,
        timeRemaining: "2m 30s",
      },
      {
        id: "2",
        name: "presentation.pptx",
        progress: 78,
        timeRemaining: "45s",
      },
      {
        id: "3",
        name: "spreadsheet.xlsx",
        progress: 12,
        timeRemaining: "5m 12s",
      },
      {
        id: "4",
        name: "image.jpg",
        progress: 100,
        timeRemaining: "Complete",
      },
    ],
    [],
  );

  return (
    <Example title="File Upload List">
      <ItemGroup>
        {files.map((file) => (
          <Item className="px-0" key={file.id} size="xs">
            <ItemMedia variant="icon">
              <FileIcon className="size-5" />
            </ItemMedia>
            <ItemContent className="inline-block truncate">
              <ItemTitle className="inline">{file.name}</ItemTitle>
            </ItemContent>
            <ItemContent>
              <Progress className="w-32" value={file.progress} />
            </ItemContent>
            <ItemActions className="w-16 justify-end">
              <span className="text-muted-foreground text-sm">
                {file.timeRemaining}
              </span>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </Example>
  );
}
