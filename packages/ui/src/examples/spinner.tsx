"use client";

// Examples adapted from the shadcn/ui Spinner docs (MIT, https://ui.shadcn.com).

import { ArrowRightIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../components/empty";
import { Field, FieldLabel } from "../components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../components/input-group";
import { Spinner } from "../components/spinner";

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

export function SpinnerBasic() {
  return (
    <Example title="Basic">
      <div className="flex items-center gap-6">
        <Spinner />
        <Spinner className="size-6" />
      </div>
    </Example>
  );
}

export function SpinnerInButtons() {
  return (
    <Example title="In Buttons">
      <div className="flex flex-wrap items-center gap-4">
        <Button>
          <Spinner data-icon="inline-start" /> Submit
        </Button>
        <Button disabled>
          <Spinner data-icon="inline-start" /> Disabled
        </Button>
        <Button disabled variant="outline">
          <Spinner data-icon="inline-start" /> Outline
        </Button>
        <Button disabled size="icon" variant="outline">
          <Spinner data-icon="inline-start" />
          <span className="sr-only">Loading...</span>
        </Button>
      </div>
    </Example>
  );
}

export function SpinnerInBadges() {
  return (
    <Example className="items-center justify-center" title="In Badges">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Badge>
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="secondary">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="destructive">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
        <Badge variant="outline">
          <Spinner data-icon="inline-start" />
          Badge
        </Badge>
      </div>
    </Example>
  );
}

export function SpinnerInInputGroup() {
  return (
    <Example title="In Input Group">
      <Field>
        <FieldLabel htmlFor="input-group-spinner">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-spinner" />
          <InputGroupAddon>
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </Example>
  );
}

export function SpinnerInEmpty() {
  return (
    <Example containerClassName="lg:col-span-full" title="In Empty State">
      <Empty className="min-h-[300px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>No projects yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <a href="#">Create project</a>
            </Button>
            <Button variant="outline">Import project</Button>
          </div>
          <Button asChild className="text-muted-foreground" variant="link">
            <a href="#">
              Learn more <ArrowRightIcon />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </Example>
  );
}
