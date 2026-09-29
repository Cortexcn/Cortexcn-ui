"use client";

// Examples adapted from the shadcn/ui Sheet docs (MIT, https://ui.shadcn.com).

import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import { Field, FieldGroup, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/sheet";

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

export function SheetWithForm() {
  return (
    <Example title="With Form">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div className="style-luma:px-6 style-lyra:px-4 style-maia:px-6 style-mira:px-6 style-nova:px-4 style-rhea:px-6 style-sera:px-8 style-vega:px-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sheet-demo-name">Name</FieldLabel>
                <Input defaultValue="Pedro Duarte" id="sheet-demo-name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="sheet-demo-username">Username</FieldLabel>
                <Input defaultValue="@peduarte" id="sheet-demo-username" />
              </Field>
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Example>
  );
}

export function SheetNoCloseButton() {
  return (
    <Example title="No Close Button">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">No Close Button</Button>
        </SheetTrigger>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>No Close Button</SheetTitle>
            <SheetDescription>
              This sheet doesn&apos;t have a close button in the top-right
              corner. You can only close it using the button below.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Example>
  );
}

const SHEET_SIDES = ["top", "right", "bottom", "left"] as const;

export function SheetWithSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-wrap gap-2">
        {SHEET_SIDES.map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button
                className="style-sera:uppercase capitalize"
                variant="outline"
              >
                {side}
              </Button>
            </SheetTrigger>
            <SheetContent
              className="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
              side={side}
            >
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you&apos;re
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="no-scrollbar overflow-y-auto style-luma:px-6 style-lyra:px-4 style-maia:px-6 style-mira:px-6 style-nova:px-4 style-rhea:px-6 style-sera:px-8 style-vega:px-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <p
                    className="mb-4 style-lyra:mb-2 leading-normal style-lyra:leading-relaxed style-sera:leading-relaxed"
                    key={index}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                ))}
              </div>
              <SheetFooter>
                <Button type="submit">Save changes</Button>
                <SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </div>
    </Example>
  );
}
