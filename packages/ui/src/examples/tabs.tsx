"use client";

// Examples adapted from the shadcn/ui Tabs docs (MIT, https://ui.shadcn.com).

import {
  AppWindowIcon,
  CodeIcon,
  HomeIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Input } from "../components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/tabs";

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

export function TabsBasic() {
  return (
    <Example title="Basic">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsLine() {
  return (
    <Example title="Line">
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsVariantsComparison() {
  return (
    <Example title="Variants Alignment">
      <div className="flex gap-4">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </Example>
  );
}

export function TabsDisabled() {
  return (
    <Example title="Disabled">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger disabled value="settings">
            Disabled
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsWithIcons() {
  return (
    <Example title="With Icons">
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">
            <AppWindowIcon data-icon="inline-start" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code">
            <CodeIcon data-icon="inline-start" />
            Code
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsIconOnly() {
  return (
    <Example title="Icon Only">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home">
            <HomeIcon />
          </TabsTrigger>
          <TabsTrigger value="search">
            <SearchIcon />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsMultiple() {
  return (
    <Example title="Multiple">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsWithContent() {
  return (
    <Example title="With Content">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="style-luma:rounded-xl style-lyra:rounded-none style-maia:rounded-xl style-mira:rounded-md style-nova:rounded-lg style-rhea:rounded-xl style-sera:rounded-none style-vega:rounded-lg border style-luma:p-6 style-lyra:p-4 style-maia:p-6 style-mira:p-4 style-nova:p-4 style-rhea:p-6 style-sera:p-6 style-vega:p-6">
          <TabsContent value="account">
            Manage your account preferences and profile information.
          </TabsContent>
          <TabsContent value="password">
            Update your password to keep your account secure.
          </TabsContent>
          <TabsContent value="notifications">
            Configure how you receive notifications and alerts.
          </TabsContent>
        </div>
      </Tabs>
    </Example>
  );
}

export function TabsLineWithContent() {
  return (
    <Example title="Line With Content">
      <Tabs defaultValue="account">
        <TabsList variant="line">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="style-luma:rounded-xl style-lyra:rounded-none style-maia:rounded-xl style-mira:rounded-md style-nova:rounded-lg style-rhea:rounded-xl style-sera:rounded-none style-vega:rounded-lg border style-luma:p-6 style-lyra:p-4 style-maia:p-6 style-mira:p-4 style-nova:p-4 style-rhea:p-6 style-sera:p-6 style-vega:p-6">
          <TabsContent value="account">
            Manage your account preferences and profile information.
          </TabsContent>
          <TabsContent value="password">
            Update your password to keep your account secure.
          </TabsContent>
          <TabsContent value="notifications">
            Configure how you receive notifications and alerts.
          </TabsContent>
        </div>
      </Tabs>
    </Example>
  );
}

export function TabsLineDisabled() {
  return (
    <Example title="Line Disabled">
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger disabled value="reports">
            Reports
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Example>
  );
}

export function TabsWithDropdown() {
  return (
    <Example title="With Dropdown">
      <Tabs defaultValue="overview">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-8" size="icon" variant="ghost">
                <MoreHorizontalIcon />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="style-luma:rounded-xl style-lyra:rounded-none style-maia:rounded-xl style-mira:rounded-md style-nova:rounded-lg style-rhea:rounded-xl style-sera:rounded-none style-vega:rounded-lg border style-luma:p-6 style-lyra:p-4 style-maia:p-6 style-mira:p-4 style-nova:p-4 style-rhea:p-6 style-sera:p-6 style-vega:p-6">
          <TabsContent value="overview">
            View your dashboard metrics and key performance indicators.
          </TabsContent>
          <TabsContent value="analytics">
            Detailed analytics and insights about your data.
          </TabsContent>
          <TabsContent value="reports">
            Generate and view custom reports.
          </TabsContent>
        </div>
      </Tabs>
    </Example>
  );
}

export function TabsVertical() {
  return (
    <Example title="Vertical">
      <Tabs defaultValue="account" orientation="vertical">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <div className="style-luma:rounded-xl style-lyra:rounded-none style-maia:rounded-xl style-mira:rounded-md style-nova:rounded-lg style-rhea:rounded-xl style-sera:rounded-none style-vega:rounded-lg border style-luma:p-6 style-lyra:p-4 style-maia:p-6 style-mira:p-4 style-nova:p-4 style-rhea:p-6 style-sera:p-6 style-vega:p-6">
          <TabsContent value="account">
            Manage your account preferences and profile information.
          </TabsContent>
          <TabsContent value="password">
            Update your password to keep your account secure. Use a strong
            password with a mix of letters, numbers, and symbols.
          </TabsContent>
          <TabsContent value="notifications">
            Configure how you receive notifications and alerts. Choose which
            types of notifications you want to receive and how you want to
            receive them.
          </TabsContent>
        </div>
      </Tabs>
    </Example>
  );
}

export function TabsWithInputAndButton() {
  return (
    <Example containerClassName="col-span-full" title="With Input and Button">
      <Tabs className="mx-auto w-full max-w-lg" defaultValue="overview">
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Input className="w-44" placeholder="Search..." />
            <Button>Action</Button>
          </div>
        </div>
        <div className="style-luma:rounded-xl style-lyra:rounded-none style-maia:rounded-xl style-mira:rounded-md style-nova:rounded-lg style-rhea:rounded-xl style-sera:rounded-none style-vega:rounded-lg border style-luma:p-6 style-lyra:p-4 style-maia:p-6 style-mira:p-4 style-nova:p-4 style-rhea:p-6 style-sera:p-6 style-vega:p-6">
          <TabsContent value="overview">
            View your dashboard metrics and key performance indicators.
          </TabsContent>
          <TabsContent value="analytics">
            Detailed analytics and insights about your data.
          </TabsContent>
          <TabsContent value="reports">
            Generate and view custom reports.
          </TabsContent>
        </div>
      </Tabs>
    </Example>
  );
}
