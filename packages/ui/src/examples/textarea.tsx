"use client";

// Examples adapted from the shadcn/ui Textarea docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldLabel } from "../components/field";
import { Textarea } from "../components/textarea";

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

export function TextareaBasic() {
  return (
    <Example title="Basic">
      <Textarea placeholder="Type your message here." />
    </Example>
  );
}

export function TextareaInvalid() {
  return (
    <Example title="Invalid">
      <Textarea aria-invalid="true" placeholder="Type your message here." />
    </Example>
  );
}

export function TextareaWithLabel() {
  return (
    <Example title="With Label">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message"
          placeholder="Type your message here."
          rows={6}
        />
      </Field>
    </Example>
  );
}

export function TextareaWithDescription() {
  return (
    <Example title="With Description">
      <Field>
        <FieldLabel htmlFor="textarea-demo-message-2">Message</FieldLabel>
        <Textarea
          id="textarea-demo-message-2"
          placeholder="Type your message here."
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </Example>
  );
}

export function TextareaDisabled() {
  return (
    <Example title="Disabled">
      <Field>
        <FieldLabel htmlFor="textarea-demo-disabled">Message</FieldLabel>
        <Textarea
          disabled
          id="textarea-demo-disabled"
          placeholder="Type your message here."
        />
      </Field>
    </Example>
  );
}
