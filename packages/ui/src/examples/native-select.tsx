"use client";

// Examples adapted from the shadcn/ui Native Select docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel } from "../components/field";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "../components/native-select";

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

export function NativeSelectBasic() {
  return (
    <Example title="Basic">
      <NativeSelect>
        <NativeSelectOption value="">Select a fruit</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        <NativeSelectOption disabled value="grapes">
          Grapes
        </NativeSelectOption>
        <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
      </NativeSelect>
    </Example>
  );
}

export function NativeSelectWithGroups() {
  return (
    <Example title="With Groups">
      <NativeSelect>
        <NativeSelectOption value="">Select a food</NativeSelectOption>
        <NativeSelectOptGroup label="Fruits">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Vegetables">
          <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
          <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
          <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </Example>
  );
}

export function NativeSelectSizes() {
  return (
    <Example title="Sizes">
      <div className="flex flex-col gap-4">
        <NativeSelect size="sm">
          <NativeSelectOption value="">Select a fruit</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelect>
        <NativeSelect size="default">
          <NativeSelectOption value="">Select a fruit</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelect>
      </div>
    </Example>
  );
}

export function NativeSelectWithField() {
  return (
    <Example title="With Field">
      <Field>
        <FieldLabel htmlFor="native-select-country">Country</FieldLabel>
        <NativeSelect id="native-select-country">
          <NativeSelectOption value="">Select a country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
          <NativeSelectOption value="au">Australia</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>Select your country of residence.</FieldDescription>
      </Field>
    </Example>
  );
}

export function NativeSelectDisabled() {
  return (
    <Example title="Disabled">
      <NativeSelect disabled>
        <NativeSelectOption value="">Disabled</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    </Example>
  );
}

export function NativeSelectInvalid() {
  return (
    <Example title="Invalid">
      <NativeSelect aria-invalid="true">
        <NativeSelectOption value="">Error state</NativeSelectOption>
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelect>
    </Example>
  );
}
