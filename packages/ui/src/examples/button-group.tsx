"use client";

// Examples adapted from the shadcn/ui Button Group docs (MIT, https://ui.shadcn.com).

import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AudioLinesIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  RotateCwIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import { ButtonGroup, ButtonGroupText } from "../components/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Field, FieldGroup } from "../components/field";
import { Input } from "../components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../components/input-group";
import { Label } from "../components/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";

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

export function ButtonGroupBasic() {
  return (
    <Example title="Basic">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Button</Button>
          <Button variant="outline">Another Button</Button>
        </ButtonGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupWithInput() {
  return (
    <Example title="With Input">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Button</Button>
          <Input placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <Input placeholder="Type something here..." />
          <Button variant="outline">Button</Button>
        </ButtonGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupWithText() {
  return (
    <Example title="With Text">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <ButtonGroupText>Text</ButtonGroupText>
          <Button variant="outline">Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText asChild>
            <Label htmlFor="input-text">GPU Size</Label>
          </ButtonGroupText>
          <Input
            className="style-luma:border-border"
            id="input-text"
            placeholder="Type something here..."
          />
        </ButtonGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupWithDropdown() {
  return (
    <Example title="With Dropdown">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">Update</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Disable</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                Uninstall
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Follow</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-50">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <VolumeOffIcon />
                  Mute Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckIcon />
                  Mark as Read
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertTriangleIcon />
                  Report Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserRoundXIcon />
                  Block User
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShareIcon />
                  Share Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon />
                  Copy Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <TrashIcon />
                  Delete Conversation
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupWithSelect() {
  const [currency, setCurrency] = useState("$");

  return (
    <Example title="With Select">
      <Field>
        <Label htmlFor="amount">Amount</Label>
        <ButtonGroup>
          <Select onValueChange={setCurrency} value={currency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="$">$</SelectItem>
                <SelectItem value="€">€</SelectItem>
                <SelectItem value="£">£</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="Enter amount to send" />
          <Button variant="outline">
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </Field>
    </Example>
  );
}

export function ButtonGroupWithIcons() {
  return (
    <Example title="With Icons">
      <div className="flex flex-col gap-4">
        <ButtonGroup>
          <Button variant="outline">
            <FlipHorizontalIcon />
          </Button>
          <Button variant="outline">
            <FlipVerticalIcon />
          </Button>
          <Button variant="outline">
            <RotateCwIcon />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupWithInputGroup() {
  return (
    <Example title="With Input Group">
      <div className="flex flex-col gap-4">
        <InputGroup>
          <InputGroupInput placeholder="Type to search..." />
          <InputGroupAddon
            align="inline-start"
            className="text-muted-foreground"
          >
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupWithFields() {
  return (
    <Example title="With Fields">
      <FieldGroup className="grid grid-cols-3 gap-4">
        <Field className="col-span-2">
          <Label htmlFor="width">Width</Label>
          <ButtonGroup>
            <InputGroup>
              <InputGroupInput id="width" />
              <InputGroupAddon className="text-muted-foreground">
                W
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                className="text-muted-foreground"
              >
                px
              </InputGroupAddon>
            </InputGroup>
            <Button size="icon" variant="outline">
              <MinusIcon />
            </Button>
            <Button size="icon" variant="outline">
              <PlusIcon />
            </Button>
          </ButtonGroup>
        </Field>
      </FieldGroup>
    </Example>
  );
}

export function ButtonGroupWithLike() {
  return (
    <Example title="With Like">
      <ButtonGroup>
        <Button variant="outline">
          <HeartIcon data-icon="inline-start" /> Like
        </Button>
        <Button asChild className="w-12" size="icon" variant="outline">
          <span>1.2K</span>
        </Button>
      </ButtonGroup>
    </Example>
  );
}

export function ButtonGroupWithSelectAndInput() {
  return (
    <Example title="With Select and Input">
      <ButtonGroup>
        <Select defaultValue="hours">
          <SelectTrigger id="duration">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="hours">Hours</SelectItem>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input />
      </ButtonGroup>
    </Example>
  );
}

export function ButtonGroupNested() {
  return (
    <Example title="Nested">
      <ButtonGroup>
        <ButtonGroup>
          <Button size="icon" variant="outline">
            <PlusIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput placeholder="Send a message..." />
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupAddon align="inline-end">
                  <AudioLinesIcon />
                </InputGroupAddon>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  );
}

export function ButtonGroupPagination() {
  return (
    <Example title="Pagination">
      <ButtonGroup>
        <Button size="sm" variant="outline">
          <ArrowLeftIcon data-icon="inline-start" />
          Previous
        </Button>
        <Button size="sm" variant="outline">
          1
        </Button>
        <Button size="sm" variant="outline">
          2
        </Button>
        <Button size="sm" variant="outline">
          3
        </Button>
        <Button size="sm" variant="outline">
          4
        </Button>
        <Button size="sm" variant="outline">
          5
        </Button>
        <Button size="sm" variant="outline">
          Next
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </ButtonGroup>
    </Example>
  );
}

export function ButtonGroupPaginationSplit() {
  return (
    <Example title="Pagination Split">
      <ButtonGroup>
        <ButtonGroup>
          <Button size="sm" variant="outline">
            1
          </Button>
          <Button size="sm" variant="outline">
            2
          </Button>
          <Button size="sm" variant="outline">
            3
          </Button>
          <Button size="sm" variant="outline">
            4
          </Button>
          <Button size="sm" variant="outline">
            5
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="icon-xs" variant="outline">
            <ArrowLeftIcon />
          </Button>
          <Button size="icon-xs" variant="outline">
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  );
}

export function ButtonGroupNavigation() {
  return (
    <Example title="Navigation">
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">
            <ArrowLeftIcon />
          </Button>
          <Button variant="outline">
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Single navigation button">
          <Button size="icon" variant="outline">
            <ArrowLeftIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  );
}

export function ButtonGroupTextAlignment() {
  return (
    <Example title="Text Alignment">
      <Field>
        <Label id="alignment-label">Text Alignment</Label>
        <ButtonGroup aria-labelledby="alignment-label">
          <Button size="sm" variant="outline">
            Left
          </Button>
          <Button size="sm" variant="outline">
            Center
          </Button>
          <Button size="sm" variant="outline">
            Right
          </Button>
          <Button size="sm" variant="outline">
            Justify
          </Button>
        </ButtonGroup>
      </Field>
    </Example>
  );
}

export function ButtonGroupVertical() {
  return (
    <Example title="Vertical">
      <div className="flex gap-6">
        <ButtonGroup
          aria-label="Media controls"
          className="h-fit"
          orientation="vertical"
        >
          <Button size="icon" variant="outline">
            <PlusIcon />
          </Button>
          <Button size="icon" variant="outline">
            <MinusIcon />
          </Button>
        </ButtonGroup>
      </div>
    </Example>
  );
}

export function ButtonGroupVerticalNested() {
  return (
    <Example title="Vertical Nested">
      <ButtonGroup aria-label="Design tools palette" orientation="vertical">
        <ButtonGroup orientation="vertical">
          <Button size="icon" variant="outline">
            <SearchIcon />
          </Button>
          <Button size="icon" variant="outline">
            <CopyIcon />
          </Button>
          <Button size="icon" variant="outline">
            <ShareIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup orientation="vertical">
          <Button size="icon" variant="outline">
            <FlipHorizontalIcon />
          </Button>
          <Button size="icon" variant="outline">
            <FlipVerticalIcon />
          </Button>
          <Button size="icon" variant="outline">
            <RotateCwIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="icon" variant="outline">
            <TrashIcon />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Example>
  );
}
