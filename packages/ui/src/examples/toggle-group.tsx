"use client";

// Examples adapted from the shadcn/ui Toggle Group docs (MIT, https://ui.shadcn.com).

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoldIcon,
  BookmarkIcon,
  HeartIcon,
  ItalicIcon,
  StarIcon,
  TrendingUpIcon,
  UnderlineIcon,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { ToggleGroup, ToggleGroupItem } from "../components/toggle-group";

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

export function ToggleGroupBasic() {
  return (
    <Example title="Basic">
      <ToggleGroup spacing={1} type="multiple">
        <ToggleGroupItem aria-label="Toggle bold" value="bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle italic" value="italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle underline" value="underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupOutline() {
  return (
    <Example title="Outline">
      <ToggleGroup defaultValue="all" type="single" variant="outline">
        <ToggleGroupItem aria-label="Toggle all" value="all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle missed" value="missed">
          Missed
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupOutlineWithIcons() {
  return (
    <Example title="Outline With Icons">
      <ToggleGroup size="sm" type="multiple" variant="outline">
        <ToggleGroupItem aria-label="Toggle bold" value="bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle italic" value="italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle underline" value="underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-4">
        <ToggleGroup
          defaultValue="top"
          size="sm"
          type="single"
          variant="outline"
        >
          <ToggleGroupItem aria-label="Toggle top" value="top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle bottom" value="bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle left" value="left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle right" value="right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup defaultValue="top" type="single" variant="outline">
          <ToggleGroupItem aria-label="Toggle top" value="top">
            Top
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle bottom" value="bottom">
            Bottom
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle left" value="left">
            Left
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Toggle right" value="right">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Example>
  );
}

export function ToggleGroupSpacing() {
  return (
    <Example title="With Spacing">
      <ToggleGroup defaultValue="top" size="sm" spacing={2} type="single">
        <ToggleGroupItem aria-label="Toggle top" value="top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle bottom" value="bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle left" value="left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle right" value="right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupWithIcons() {
  return (
    <Example title="With Icons">
      <ToggleGroup size="sm" spacing={1} type="multiple" variant="outline">
        <ToggleGroupItem
          aria-label="Toggle star"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foregfill-foreground"
          value="star"
        >
          <StarIcon data-icon="inline-start" />
          Star
        </ToggleGroupItem>
        <ToggleGroupItem
          aria-label="Toggle heart"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
          value="heart"
        >
          <HeartIcon data-icon="inline-start" />
          Heart
        </ToggleGroupItem>
        <ToggleGroupItem
          aria-label="Toggle bookmark"
          className="aria-pressed:bg-transparent aria-pressed:*:[svg]:fill-foreground aria-pressed:*:[svg]:stroke-foreground"
          value="bookmark"
        >
          <BookmarkIcon data-icon="inline-start" />
          Bookmark
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupFilter() {
  return (
    <Example title="Filter">
      <ToggleGroup defaultValue="all" size="sm" type="single" variant="outline">
        <ToggleGroupItem aria-label="All" value="all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Active" value="active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Completed" value="completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Archived" value="archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupDateRange() {
  return (
    <Example title="Date Range">
      <ToggleGroup
        defaultValue="today"
        size="sm"
        spacing={2}
        type="single"
        variant="outline"
      >
        <ToggleGroupItem aria-label="Today" value="today">
          Today
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="This Week" value="week">
          This Week
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="This Month" value="month">
          This Month
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="This Year" value="year">
          This Year
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupSort() {
  return (
    <Example title="Sort">
      <ToggleGroup
        defaultValue="newest"
        size="sm"
        type="single"
        variant="outline"
      >
        <ToggleGroupItem aria-label="Newest" value="newest">
          <ArrowDownIcon data-icon="inline-start" />
          Newest
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Oldest" value="oldest">
          <ArrowUpIcon data-icon="inline-start" />
          Oldest
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Popular" value="popular">
          <TrendingUpIcon data-icon="inline-start" />
          Popular
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupWithInputAndSelect() {
  return (
    <Example title="With Input and Select">
      <div className="flex items-center gap-2">
        <Input className="flex-1" placeholder="Search..." type="search" />
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <ToggleGroup defaultValue="grid" type="single" variant="outline">
          <ToggleGroupItem aria-label="Grid view" value="grid">
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="List view" value="list">
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Example>
  );
}

export function ToggleGroupVertical() {
  return (
    <Example title="Vertical">
      <ToggleGroup orientation="vertical" spacing={2} type="multiple">
        <ToggleGroupItem aria-label="Toggle bold" value="bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle italic" value="italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle underline" value="underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupVerticalOutline() {
  return (
    <Example title="Vertical Outline">
      <ToggleGroup
        defaultValue="all"
        orientation="vertical"
        size="sm"
        type="single"
        variant="outline"
      >
        <ToggleGroupItem aria-label="Toggle all" value="all">
          All
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle active" value="active">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle completed" value="completed">
          Completed
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle archived" value="archived">
          Archived
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupVerticalOutlineWithIcons() {
  return (
    <Example title="Vertical Outline With Icons">
      <ToggleGroup
        orientation="vertical"
        size="sm"
        type="multiple"
        variant="outline"
      >
        <ToggleGroupItem aria-label="Toggle bold" value="bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle italic" value="italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle underline" value="underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}

export function ToggleGroupFontWeightSelector() {
  const [fontWeight, setFontWeight] = React.useState("normal");
  return (
    <Example title="Font Weight Selector">
      <Field>
        <FieldLabel>Font Weight</FieldLabel>
        <ToggleGroup
          onValueChange={(value) => setFontWeight(value)}
          size="lg"
          spacing={2}
          type="single"
          value={fontWeight}
          variant="outline"
        >
          <ToggleGroupItem
            aria-label="Light"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
            value="light"
          >
            <span className="font-light text-2xl leading-none">Aa</span>
            <span className="text-muted-foreground text-xs">Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label="Normal"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
            value="normal"
          >
            <span className="font-normal text-2xl leading-none">Aa</span>
            <span className="text-muted-foreground text-xs">Normal</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label="Medium"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
            value="medium"
          >
            <span className="font-medium text-2xl leading-none">Aa</span>
            <span className="text-muted-foreground text-xs">Medium</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            aria-label="Bold"
            className="flex size-16 flex-col items-center justify-center rounded-xl"
            value="bold"
          >
            <span className="font-bold text-2xl leading-none">Aa</span>
            <span className="text-muted-foreground text-xs">Bold</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <FieldDescription>
          Use{" "}
          <code className="rounded-md bg-muted px-1 py-0.5 font-mono">
            font-{fontWeight}
          </code>{" "}
          to set the font weight.
        </FieldDescription>
      </Field>
    </Example>
  );
}

export function ToggleGroupVerticalWithSpacing() {
  return (
    <Example title="Vertical With Spacing">
      <ToggleGroup
        defaultValue="top"
        orientation="vertical"
        size="sm"
        spacing={2}
        type="single"
      >
        <ToggleGroupItem aria-label="Toggle top" value="top">
          Top
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle bottom" value="bottom">
          Bottom
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle left" value="left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Toggle right" value="right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </Example>
  );
}
