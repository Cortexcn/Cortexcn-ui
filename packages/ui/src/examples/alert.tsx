"use client";

// Examples adapted from the shadcn/ui Alert docs (MIT, https://ui.shadcn.com).

import { CircleAlertIcon, FolderIcon } from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "../components/alert";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { Field, FieldGroup, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../components/item";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

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

export function AlertExample1() {
  return (
    <Example className="style-sera:bg-transparent" title="Basic">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
        </Alert>
        <Alert>
          <AlertTitle>Success! Your changes have been saved.</AlertTitle>
          <AlertDescription>
            This is an alert with title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertDescription>
            This one has a description only. No title. No icon.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  );
}

export function AlertExample2() {
  return (
    <Example className="style-sera:bg-transparent" title="With Icons">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>
            Let&apos;s try one with icon, title and a <a href="#">link</a>.
          </AlertTitle>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertDescription>
            This one has an icon and a description only. No title.{" "}
            <a href="#">But it has a link</a> and a <a href="#">second link</a>.
          </AlertDescription>
        </Alert>

        <Alert>
          <CircleAlertIcon />
          <AlertTitle>Success! Your changes have been saved</AlertTitle>
          <AlertDescription>
            This is an alert with icon, title and description.
          </AlertDescription>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>
            This is a very long alert title that demonstrates how the component
            handles extended text content and potentially wraps across multiple
            lines
          </AlertTitle>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertDescription>
            This is a very long alert description that demonstrates how the
            component handles extended text content and potentially wraps across
            multiple lines
          </AlertDescription>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>
            This is an extremely long alert title that spans multiple lines to
            demonstrate how the component handles very lengthy headings while
            maintaining readability and proper text wrapping behavior
          </AlertTitle>
          <AlertDescription>
            This is an equally long description that contains detailed
            information about the alert. It shows how the component can
            accommodate extensive content while preserving proper spacing,
            alignment, and readability across different screen sizes and
            viewport widths. This helps ensure the user experience remains
            consistent regardless of the content length.
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  );
}

export function AlertExample3() {
  return (
    <Example className="style-sera:bg-transparent" title="Destructive">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            Your session has expired. Please log in again.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>Unable to process your payment.</AlertTitle>
          <AlertDescription>
            <p>
              Please verify your <a href="#">billing information</a> and try
              again.
            </p>
            <ul className="list-inside list-disc">
              <li>Check your card details</li>
              <li>Ensure sufficient funds</li>
              <li>Verify billing address</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </Example>
  );
}

export function AlertExample4() {
  return (
    <Example className="style-sera:bg-transparent" title="With Actions">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
          <AlertAction>
            <Button size="xs">Undo</Button>
          </AlertAction>
        </Alert>
        <Alert>
          <CircleAlertIcon />
          <AlertTitle>The selected emails have been marked as spam.</AlertTitle>
          <AlertDescription>
            This is a very long alert title that demonstrates how the component
            handles extended text content.
          </AlertDescription>
          <AlertAction>
            <Badge variant="secondary">Badge</Badge>
          </AlertAction>
        </Alert>
      </div>
    </Example>
  );
}

export function AlertExample5() {
  return (
    <Example className="style-sera:bg-transparent" title="Inside Card">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Fill in the form below to create a new project.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 style-sera:gap-8">
          <Alert>
            <CircleAlertIcon />
            <AlertTitle>
              You have reached the limit of 3 free projects.
            </AlertTitle>
            <AlertDescription>
              Upgrade to Pro to create unlimited projects.
            </AlertDescription>
          </Alert>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="project-name">Name</FieldLabel>
              <Input id="project-name" placeholder="My project" />
            </Field>
            <Field>
              <FieldLabel htmlFor="project-framework">Framework</FieldLabel>
              <Select>
                <SelectTrigger id="project-framework">
                  <SelectValue placeholder="Select a framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="remix">Remix</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <Item variant="outline">
            <ItemMedia className="border" variant="image">
              <FolderIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Project Alpha</ItemTitle>
              <ItemDescription>Created 2 days ago</ItemDescription>
            </ItemContent>
          </Item>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create project</Button>
        </CardFooter>
      </Card>
    </Example>
  );
}
