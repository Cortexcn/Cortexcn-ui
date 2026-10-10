"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@cortexcn/ui/components/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@cortexcn/ui/components/alert";
import { Badge } from "@cortexcn/ui/components/badge";
import { Button } from "@cortexcn/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cortexcn/ui/components/card";
import { Checkbox } from "@cortexcn/ui/components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@cortexcn/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@cortexcn/ui/components/dropdown-menu";
import { Input } from "@cortexcn/ui/components/input";
import { Label } from "@cortexcn/ui/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@cortexcn/ui/components/native-select";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@cortexcn/ui/components/popover";
import { Progress } from "@cortexcn/ui/components/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@cortexcn/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@cortexcn/ui/components/select";
import { Slider } from "@cortexcn/ui/components/slider";
import { Switch } from "@cortexcn/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cortexcn/ui/components/tabs";
import { Textarea } from "@cortexcn/ui/components/textarea";
import { Toggle } from "@cortexcn/ui/components/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@cortexcn/ui/components/tooltip";
import { Bold, Info, Italic, Plus, Search } from "lucide-react";
import type { ReactNode } from "react";

const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "ghost",
] as const;

const SHADOWS = ["shadow-xs", "shadow-md", "shadow-lg"] as const;

const COLOR_ROLES = [
  "background",
  "foreground",
  "card",
  "primary",
  "primary-foreground",
  "secondary",
  "muted",
  "muted-foreground",
  "accent",
  "border",
  "input",
  "ring",
  "destructive",
  "chart-1",
  "chart-2",
  "chart-3",
] as const;

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t pt-6">
      <div className="flex flex-col gap-1">
        <h2 className="ds-heading text-lg">{title}</h2>
        {note ? <p className="text-muted-foreground text-sm">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-muted-foreground text-xs">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Buttons() {
  return (
    <Section
      note="Hover and focus them with the mouse and keyboard; disabled and invalid are shown fixed."
      title="Buttons and toggles"
    >
      <Row label="variants">
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </Row>
      <Row label="sizes">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
        <Button aria-label="Add" size="icon-sm" variant="outline">
          <Plus />
        </Button>
        <Button aria-label="Add" size="icon" variant="outline">
          <Plus />
        </Button>
        <Button aria-label="Add" size="icon-lg" variant="outline">
          <Plus />
        </Button>
      </Row>
      <Row label="states">
        <Button disabled>Disabled</Button>
        <Button disabled variant="outline">
          Disabled outline
        </Button>
        <Button aria-invalid variant="outline">
          Invalid
        </Button>
        <Button>
          <Search data-icon="inline-start" />
          With icon
        </Button>
      </Row>
      <Row label="toggles">
        <Toggle aria-label="Bold">
          <Bold />
        </Toggle>
        <Toggle aria-label="Italic" defaultPressed>
          <Italic />
        </Toggle>
        <Toggle variant="outline">Outline</Toggle>
        <Toggle defaultPressed variant="outline">
          Pressed
        </Toggle>
        <Toggle disabled variant="outline">
          Disabled
        </Toggle>
      </Row>
    </Section>
  );
}

function Badges() {
  return (
    <Section title="Badges">
      <Row label="variants">
        {BADGE_VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </Row>
    </Section>
  );
}

function Fields() {
  return (
    <Section title="Inputs and selection">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="ds-email">Email</Label>
          <Input id="ds-email" placeholder="you@example.com" type="email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ds-invalid">Invalid</Label>
          <Input aria-invalid defaultValue="not an email" id="ds-invalid" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ds-disabled">Disabled</Label>
          <Input defaultValue="Read only" disabled id="ds-disabled" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="ds-plan">Native select</Label>
          <NativeSelect defaultValue="team" id="ds-plan">
            <NativeSelectOption value="free">Free</NativeSelectOption>
            <NativeSelectOption value="team">Team</NativeSelectOption>
            <NativeSelectOption value="enterprise">
              Enterprise
            </NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Select</Label>
          <Select defaultValue="weekly">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 sm:row-span-2">
          <Label htmlFor="ds-notes">Textarea</Label>
          <Textarea id="ds-notes" placeholder="Write a note" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox defaultChecked id="ds-check-on" />
            <Label htmlFor="ds-check-on">Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="ds-check-off" />
            <Label htmlFor="ds-check-off">Unchecked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox disabled id="ds-check-disabled" />
            <Label htmlFor="ds-check-disabled">Disabled</Label>
          </div>
        </div>
        <RadioGroup defaultValue="comfortable">
          {["compact", "comfortable", "spacious"].map((value) => (
            <div className="flex items-center gap-2" key={value}>
              <RadioGroupItem id={`ds-radio-${value}`} value={value} />
              <Label htmlFor={`ds-radio-${value}`}>{value}</Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex items-center gap-3">
          <Switch defaultChecked id="ds-switch-on" />
          <Label htmlFor="ds-switch-on">On</Label>
          <Switch id="ds-switch-off" />
          <Label htmlFor="ds-switch-off">Off</Label>
        </div>
        <div className="flex flex-col gap-3">
          <Slider aria-label="Volume" defaultValue={[60]} max={100} />
          <Progress aria-label="Upload" value={42} />
        </div>
      </div>
    </Section>
  );
}

function TabsAndAccordion() {
  return (
    <Section title="Tabs and accordion">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent className="text-muted-foreground" value="overview">
              The default tabs follow the system: segmented or underlined.
            </TabsContent>
            <TabsContent className="text-muted-foreground" value="activity">
              Activity panel.
            </TabsContent>
            <TabsContent className="text-muted-foreground" value="settings">
              Settings panel.
            </TabsContent>
          </Tabs>
          <Tabs defaultValue="code">
            <TabsList variant="line">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Accordion collapsible defaultValue="open" type="single">
          <AccordionItem value="open">
            <AccordionTrigger>An open item</AccordionTrigger>
            <AccordionContent>
              Dividers, trigger weight, spacing, and the chevron turn all come
              from the system.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="closed">
            <AccordionTrigger>A closed item</AccordionTrigger>
            <AccordionContent>
              Opened with the system's motion.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="third">
            <AccordionTrigger>Another closed item</AccordionTrigger>
            <AccordionContent>More content.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Section>
  );
}

function Cards() {
  return (
    <Section title="Cards and alerts">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project usage</CardTitle>
            <CardDescription>Requests in the last 30 days.</CardDescription>
            <CardAction>
              <Badge variant="secondary">Pro</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="ds-heading text-3xl">48,210</p>
            <Progress aria-label="Quota used" value={64} />
          </CardContent>
          <CardFooter className="justify-between">
            <span className="text-muted-foreground text-xs">64% of quota</span>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Small card</CardTitle>
              <CardDescription>Tighter padding.</CardDescription>
            </CardHeader>
          </Card>
          <Alert>
            <Info />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              A default alert on the card surface.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <Info />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>Update your card to continue.</AlertDescription>
          </Alert>
        </div>
      </div>
    </Section>
  );
}

function Overlays() {
  return (
    <Section
      note="Open each one to see the overlay, menu, and popover surfaces."
      title="Overlays and menus"
    >
      <div className="flex flex-wrap gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename project</DialogTitle>
              <DialogDescription>
                The dialog's corners, padding, and shadow follow the system.
              </DialogDescription>
            </DialogHeader>
            <Input defaultValue="cortexcn-web" />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Set the width of the layer.
              </PopoverDescription>
            </PopoverHeader>
            <Input defaultValue="100%" />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover for tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip corners follow the system</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Section>
  );
}

function Foundations({ scale }: { scale: number[] }) {
  return (
    <Section title="Color, type, and elevation">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {COLOR_ROLES.map((role) => (
          <div className="flex flex-col gap-1.5" key={role}>
            <div
              className="h-10 w-full rounded-md border"
              style={{ background: `var(--${role})` }}
            />
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {role}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <p className="ds-heading text-4xl">Display type, set in the system</p>
        <p className="max-w-prose text-base">
          Body copy uses the system's body face, weight, and tracking. The quick
          brown fox jumps over the lazy dog.
        </p>
        <p className="ds-mono text-sm">const theme = &quot;mono face&quot;;</p>
        <p className="font-mono text-muted-foreground text-xs">
          scale: {scale.join(" / ")} px
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {SHADOWS.map((shadow) => (
          <div
            className={`flex h-16 items-center justify-center rounded-lg border bg-card font-mono text-muted-foreground text-xs ${shadow}`}
            key={shadow}
          >
            {shadow}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ComponentGallery({ scale }: { scale: number[] }) {
  return (
    <div className="flex flex-col gap-10">
      <Buttons />
      <Badges />
      <Fields />
      <TabsAndAccordion />
      <Cards />
      <Overlays />
      <Foundations scale={scale} />
    </div>
  );
}
