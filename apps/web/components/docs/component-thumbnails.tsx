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
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@cortexcn/ui/components/alert-dialog";
import { AspectRatio } from "@cortexcn/ui/components/aspect-ratio";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@cortexcn/ui/components/avatar";
import { Badge } from "@cortexcn/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@cortexcn/ui/components/breadcrumb";
import { Button } from "@cortexcn/ui/components/button";
import { ButtonGroup } from "@cortexcn/ui/components/button-group";
import { Calendar } from "@cortexcn/ui/components/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cortexcn/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@cortexcn/ui/components/carousel";
import { Checkbox } from "@cortexcn/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@cortexcn/ui/components/collapsible";
import { Combobox, ComboboxInput } from "@cortexcn/ui/components/combobox";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@cortexcn/ui/components/command";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cortexcn/ui/components/dialog";
import {
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@cortexcn/ui/components/drawer";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@cortexcn/ui/components/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@cortexcn/ui/components/field";
import { Input } from "@cortexcn/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@cortexcn/ui/components/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@cortexcn/ui/components/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@cortexcn/ui/components/item";
import { Kbd, KbdGroup } from "@cortexcn/ui/components/kbd";
import { Label } from "@cortexcn/ui/components/label";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@cortexcn/ui/components/menubar";
import {
  NativeSelect,
  NativeSelectOption,
} from "@cortexcn/ui/components/native-select";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@cortexcn/ui/components/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@cortexcn/ui/components/pagination";
import {
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@cortexcn/ui/components/popover";
import { Progress } from "@cortexcn/ui/components/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@cortexcn/ui/components/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@cortexcn/ui/components/resizable";
import { ScrollArea } from "@cortexcn/ui/components/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@cortexcn/ui/components/select";
import { Separator } from "@cortexcn/ui/components/separator";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@cortexcn/ui/components/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@cortexcn/ui/components/sidebar";
import { Skeleton } from "@cortexcn/ui/components/skeleton";
import { Slider } from "@cortexcn/ui/components/slider";
import { Spinner } from "@cortexcn/ui/components/spinner";
import { Switch } from "@cortexcn/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cortexcn/ui/components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cortexcn/ui/components/tabs";
import { Textarea } from "@cortexcn/ui/components/textarea";
import { Toggle } from "@cortexcn/ui/components/toggle";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@cortexcn/ui/components/toggle-group";
import {
  ArrowUpRight,
  BadgeCheck,
  Bold,
  Calculator,
  CalendarDays,
  Check,
  ChevronsUpDown,
  CircleAlert,
  FolderOpen,
  House,
  ImageIcon,
  Inbox,
  Italic,
  Search,
  Settings,
  Smile,
  Underline,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Live, non-interactive previews of each component for the overview cards.
 * Everything here is the real component. Floating parts (menus, popovers,
 * dialogs, and toasts) are drawn open in place, on the same surface tokens
 * their content uses, so nothing opens over the page.
 */

const MENU_SURFACE =
  "rounded-menu bg-popover p-1 text-popover-foreground text-sm shadow-menu ring-1 ring-foreground/10";
const DIALOG_SURFACE =
  "grid gap-4 rounded-dialog bg-popover p-4 text-popover-foreground text-sm shadow-dialog ring-1 ring-foreground/10";
const CALENDAR_DAY = new Date(2025, 5, 12);

function MenuRow({
  children,
  shortcut,
  active = false,
  checked = false,
}: {
  children: ReactNode;
  shortcut?: string;
  active?: boolean;
  checked?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-menu-item px-2 py-1.5 text-sm [&_svg]:size-4 [&_svg]:shrink-0",
        active && "bg-accent text-accent-foreground",
      )}
    >
      {children}
      {shortcut ? (
        <span className="ml-auto text-muted-foreground text-xs tracking-widest">
          {shortcut}
        </span>
      ) : null}
      {checked ? <Check className="ml-auto" /> : null}
    </div>
  );
}

function MenuSeparator() {
  return <div className="-mx-1 my-1 h-px bg-border" />;
}

const THUMBNAILS: Record<string, () => ReactNode> = {
  accordion: () => (
    <Accordion
      className="w-56"
      collapsible
      defaultValue="accessible"
      type="single"
    >
      <AccordionItem value="accessible">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It follows the WAI-ARIA pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="styled">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
      </AccordionItem>
      <AccordionItem value="animated">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
      </AccordionItem>
    </Accordion>
  ),
  alert: () => (
    <Alert className="w-60">
      <CircleAlert />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Add components to your app with the CLI.
      </AlertDescription>
    </Alert>
  ),
  "alert-dialog": () => (
    <AlertDialog>
      <div className={cn(DIALOG_SURFACE, "w-60")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This deletes your account for good.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end">
          <Button size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm">Continue</Button>
        </AlertDialogFooter>
      </div>
    </AlertDialog>
  ),
  "aspect-ratio": () => (
    <div className="w-52">
      <AspectRatio
        className="flex items-center justify-center rounded-lg bg-muted text-muted-foreground"
        ratio={16 / 9}
      >
        <ImageIcon className="size-8" />
      </AspectRatio>
      <p className="mt-2 text-center font-mono text-muted-foreground text-xs">
        16:9
      </p>
    </div>
  ),
  avatar: () => (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="size-12">
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>ML</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  ),
  badge: () => (
    <div className="flex max-w-56 flex-wrap justify-center gap-2">
      <Badge>Badge</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="secondary">
        <BadgeCheck />
        Verified
      </Badge>
    </div>
  ),
  breadcrumb: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/docs/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  button: () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        <Button>Button</Button>
        <Button variant="outline">Outline</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary">Secondary</Button>
        <Button aria-label="Open" size="icon" variant="outline">
          <ArrowUpRight />
        </Button>
      </div>
    </div>
  ),
  "button-group": () => (
    <div className="flex flex-col items-center gap-3">
      <ButtonGroup>
        <Button variant="outline">Back</Button>
        <Button variant="outline">Today</Button>
        <Button variant="outline">Next</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button aria-label="More" size="icon" variant="outline">
          <ChevronsUpDown />
        </Button>
      </ButtonGroup>
    </div>
  ),
  calendar: () => (
    <Calendar
      className="origin-center scale-[0.66] rounded-lg border"
      defaultMonth={CALENDAR_DAY}
      locale={{ code: "en-US" }}
      mode="single"
      selected={CALENDAR_DAY}
    />
  ),
  card: () => (
    <Card className="w-64 scale-90">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder="Project name" />
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
  carousel: () => (
    <Carousel className="w-32">
      <CarouselContent>
        {["1", "2", "3"].map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex aspect-square items-center justify-center rounded-xl border bg-card font-semibold text-3xl">
              {slide}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  checkbox: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox defaultChecked id="thumb-checkbox-terms" />
        <Label htmlFor="thumb-checkbox-terms">Accept terms</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="thumb-checkbox-email" />
        <Label htmlFor="thumb-checkbox-email">Email me updates</Label>
      </div>
    </div>
  ),
  collapsible: () => (
    <Collapsible className="flex w-56 flex-col gap-2" defaultOpen>
      <div className="flex items-center justify-between gap-4 px-1">
        <span className="font-semibold text-sm">3 starred repositories</span>
        <CollapsibleTrigger asChild>
          <Button aria-label="Toggle" size="icon-sm" variant="ghost">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-3 py-2 font-mono text-xs">
        cortexcn/ui
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-3 py-2 font-mono text-xs">
          cortexcn/icons
        </div>
        <div className="rounded-md border px-3 py-2 font-mono text-xs">
          cortexcn/charts
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
  combobox: () => (
    <div className="flex w-52 flex-col gap-1">
      <Combobox items={["Next.js", "Astro", "Remix"]}>
        <ComboboxInput placeholder="Select a framework" />
      </Combobox>
      <div className={MENU_SURFACE}>
        <MenuRow active checked>
          Next.js
        </MenuRow>
        <MenuRow>Astro</MenuRow>
        <MenuRow>Remix</MenuRow>
      </div>
    </div>
  ),
  command: () => (
    <Command className="w-60 rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarDays />
            Calendar
          </CommandItem>
          <CommandItem>
            <Smile />
            Search emoji
          </CommandItem>
          <CommandItem>
            <Calculator />
            Calculator
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  "context-menu": () => (
    <div className="relative h-36 w-56">
      <div className="h-32 w-52 rounded-lg border border-dashed p-3 text-muted-foreground text-xs">
        Right click here
      </div>
      <div className={cn(MENU_SURFACE, "absolute top-10 left-20 w-36")}>
        <MenuRow shortcut="⌘[">Back</MenuRow>
        <MenuRow active shortcut="⌘R">
          Reload
        </MenuRow>
        <MenuSeparator />
        <MenuRow>Inspect</MenuRow>
      </div>
    </div>
  ),
  dialog: () => (
    <Dialog>
      <div className={cn(DIALOG_SURFACE, "w-60")}>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Save when you're done.</DialogDescription>
        </DialogHeader>
        <Input defaultValue="Jordan Lee" />
        <DialogFooter className="flex-row justify-end">
          <Button size="sm">Save changes</Button>
        </DialogFooter>
      </div>
    </Dialog>
  ),
  drawer: () => (
    <Drawer>
      <div className="flex h-44 w-60 flex-col justify-end">
        <div className="rounded-t-dialog border-x border-t bg-popover px-4 pt-2 pb-4 text-popover-foreground text-sm shadow-dialog">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
          <DrawerHeader className="p-0 text-center">
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <Button className="mt-3 w-full" size="sm">
            Submit
          </Button>
        </div>
      </div>
    </Drawer>
  ),
  "dropdown-menu": () => (
    <div className="flex w-44 flex-col items-start gap-1">
      <Button size="sm" variant="outline">
        Open menu
      </Button>
      <div className={cn(MENU_SURFACE, "w-44")}>
        <div className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
          My account
        </div>
        <MenuRow active shortcut="⇧⌘P">
          Profile
        </MenuRow>
        <MenuRow shortcut="⌘B">Billing</MenuRow>
        <MenuSeparator />
        <MenuRow shortcut="⌘S">Settings</MenuRow>
      </div>
    </div>
  ),
  empty: () => (
    <Empty className="w-60 border border-dashed p-6">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpen />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create project</Button>
      </EmptyContent>
    </Empty>
  ),
  field: () => (
    <FieldGroup className="w-56 gap-4">
      <Field>
        <FieldLabel htmlFor="thumb-field-email">Email</FieldLabel>
        <Input id="thumb-field-email" placeholder="you@example.com" />
        <FieldDescription>We never share your email.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Checkbox defaultChecked id="thumb-field-remember" />
        <FieldLabel htmlFor="thumb-field-remember">Remember me</FieldLabel>
      </Field>
    </FieldGroup>
  ),
  "hover-card": () => (
    <div className="flex flex-col items-center gap-1">
      <Button variant="link">@cortexcn</Button>
      <div className="flex w-56 gap-3 rounded-menu-lg bg-popover p-4 text-popover-foreground text-sm shadow-menu ring-1 ring-foreground/10">
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">@cortexcn</span>
          <span className="text-muted-foreground text-xs">
            Components, blocks, and charts for React.
          </span>
        </div>
      </div>
    </div>
  ),
  input: () => (
    <div className="flex w-56 flex-col gap-2">
      <Label htmlFor="thumb-input-email">Email</Label>
      <Input id="thumb-input-email" placeholder="you@example.com" />
      <Input disabled placeholder="Disabled" />
    </div>
  ),
  "input-group": () => (
    <div className="flex w-56 flex-col gap-3">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText>12 results</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>
    </div>
  ),
  "input-otp": () => (
    <InputOTP containerClassName="justify-center" maxLength={6} value="2468">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  item: () => (
    <div className="flex w-60 flex-col gap-2">
      <Item size="sm" variant="outline">
        <ItemMedia>
          <BadgeCheck className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Profile verified</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant="outline">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm" variant="outline">
        <ItemContent>
          <ItemTitle>Two-factor login</ItemTitle>
          <ItemDescription>Add a second step.</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ),
  kbd: () => (
    <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
      <div className="flex items-center gap-2">
        Search
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
      <div className="flex items-center gap-2">
        Next field
        <KbdGroup>
          <Kbd>Shift</Kbd>
          <Kbd>Tab</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
  label: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="thumb-label-terms" />
      <Label htmlFor="thumb-label-terms">Accept terms and conditions</Label>
    </div>
  ),
  menubar: () => (
    <div className="flex flex-col items-start gap-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="bg-accent text-accent-foreground">
            File
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className={cn(MENU_SURFACE, "w-44")}>
        <MenuRow active shortcut="⌘T">
          New tab
        </MenuRow>
        <MenuRow shortcut="⌘N">New window</MenuRow>
        <MenuSeparator />
        <MenuRow shortcut="⌘P">Print</MenuRow>
      </div>
    </div>
  ),
  "native-select": () => (
    <div className="flex w-48 flex-col gap-2">
      <Label htmlFor="thumb-native-select">Status</Label>
      <NativeSelect defaultValue="progress" id="thumb-native-select">
        <NativeSelectOption value="todo">Todo</NativeSelectOption>
        <NativeSelectOption value="progress">In progress</NativeSelectOption>
        <NativeSelectOption value="done">Done</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
  "navigation-menu": () => (
    <div className="flex flex-col items-start gap-1">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-accent">
              Start
            </NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/docs"
            >
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="grid w-56 gap-1 rounded-menu-lg bg-popover p-2 text-popover-foreground text-sm shadow-menu ring-1 ring-foreground/10">
        <div className="rounded-menu-item bg-accent p-2">
          <div className="font-medium">Introduction</div>
          <div className="text-muted-foreground text-xs">
            How the registry works.
          </div>
        </div>
        <div className="rounded-menu-item p-2">
          <div className="font-medium">Installation</div>
          <div className="text-muted-foreground text-xs">
            Add your first component.
          </div>
        </div>
      </div>
    </div>
  ),
  pagination: () => (
    <Pagination className="origin-center scale-[0.82]">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="/docs/components/pagination" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/docs/components/pagination">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/docs/components/pagination" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/docs/components/pagination">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="/docs/components/pagination" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  popover: () => (
    <div className="flex flex-col items-center gap-1">
      <Button size="sm" variant="outline">
        Open popover
      </Button>
      <div className="flex w-56 flex-col gap-3 rounded-menu bg-popover p-4 text-popover-foreground text-sm shadow-menu ring-1 ring-foreground/10">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the layer.</PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-3 items-center gap-2">
          <Label htmlFor="thumb-popover-width">Width</Label>
          <Input
            className="col-span-2 h-8"
            defaultValue="100%"
            id="thumb-popover-width"
          />
        </div>
      </div>
    </div>
  ),
  progress: () => (
    <div className="flex w-52 flex-col gap-2">
      <div className="flex justify-between text-sm">
        <span>Uploading</span>
        <span className="text-muted-foreground tabular-nums">60%</span>
      </div>
      <Progress value={60} />
    </div>
  ),
  "radio-group": () => (
    <RadioGroup defaultValue="comfortable">
      {(
        [
          ["default", "Default"],
          ["comfortable", "Comfortable"],
          ["compact", "Compact"],
        ] as const
      ).map(([value, label]) => (
        <div className="flex items-center gap-2" key={value}>
          <RadioGroupItem id={`thumb-radio-${value}`} value={value} />
          <Label htmlFor={`thumb-radio-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  resizable: () => (
    <ResizablePanelGroup
      className="h-36 max-w-56 rounded-lg border"
      orientation="horizontal"
    >
      <ResizablePanel defaultSize="50%">
        <div className="flex h-full items-center justify-center font-semibold text-sm">
          One
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="50%">
            <div className="flex h-full items-center justify-center font-semibold text-sm">
              Two
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%">
            <div className="flex h-full items-center justify-center font-semibold text-sm">
              Three
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  "scroll-area": () => (
    <ScrollArea className="h-36 w-44 rounded-md border">
      <div className="p-3">
        <div className="mb-2 font-medium text-sm">Tags</div>
        {["v1.4.0", "v1.3.2", "v1.3.1", "v1.3.0", "v1.2.0", "v1.1.0"].map(
          (tag) => (
            <div key={tag}>
              <div className="py-1 text-sm">{tag}</div>
              <Separator />
            </div>
          ),
        )}
      </div>
    </ScrollArea>
  ),
  select: () => (
    <div className="flex w-44 flex-col gap-1">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
      </Select>
      <div className={MENU_SURFACE}>
        <MenuRow checked>Apple</MenuRow>
        <MenuRow active>Banana</MenuRow>
        <MenuRow>Blueberry</MenuRow>
      </div>
    </div>
  ),
  separator: () => (
    <div className="w-52">
      <div className="font-medium text-sm">Cortexcn</div>
      <div className="text-muted-foreground text-sm">An open registry.</div>
      <Separator className="my-3" />
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    </div>
  ),
  sheet: () => (
    <Sheet>
      <div className="relative h-44 w-60 overflow-hidden rounded-lg border bg-overlay">
        <div className="absolute inset-y-0 right-0 flex w-36 flex-col gap-3 border-l bg-popover p-3 text-popover-foreground text-sm shadow-lg">
          <SheetHeader className="p-0">
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes here.</SheetDescription>
          </SheetHeader>
          <Input className="h-8" defaultValue="Jordan" />
          <Button className="mt-auto" size="sm">
            Save
          </Button>
        </div>
      </div>
    </Sheet>
  ),
  sidebar: () => (
    <SidebarProvider
      className="min-h-0 w-60 overflow-hidden rounded-lg border"
      style={{ "--sidebar-width": "9rem" } as CSSProperties}
    >
      <Sidebar className="h-44 border-r" collapsible="none">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive size="sm">
                  <House />
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <Inbox />
                  Inbox
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm">
                  <Settings />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="mt-2 h-16 w-full" />
      </div>
    </SidebarProvider>
  ),
  skeleton: () => (
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  ),
  slider: () => (
    <div className="flex w-52 flex-col gap-6">
      <Slider defaultValue={[60]} max={100} />
      <Slider defaultValue={[25, 75]} max={100} />
    </div>
  ),
  sonner: () => (
    <div className="relative h-28 w-60">
      <div className="absolute inset-x-4 top-0 h-14 rounded-menu bg-popover opacity-60 shadow-menu ring-1 ring-foreground/10" />
      <div className="absolute inset-x-2 top-2 h-14 rounded-menu bg-popover opacity-80 shadow-menu ring-1 ring-foreground/10" />
      <div className="absolute inset-x-0 top-5 flex items-center gap-3 rounded-menu bg-popover p-3 text-popover-foreground text-sm shadow-menu ring-1 ring-foreground/10">
        <div className="flex flex-1 flex-col">
          <span className="font-medium">Event created</span>
          <span className="text-muted-foreground text-xs">
            Sunday at 9:00 AM
          </span>
        </div>
        <Button size="xs">Undo</Button>
      </div>
    </div>
  ),
  spinner: () => (
    <div className="flex flex-col items-center gap-3">
      <Spinner className="size-6" />
      <Button disabled size="sm">
        <Spinner />
        Please wait
      </Button>
      <Badge variant="secondary">
        <Spinner />
        Syncing
      </Badge>
    </div>
  ),
  switch: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="thumb-switch-airplane" />
        <Label htmlFor="thumb-switch-airplane">Airplane mode</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="thumb-switch-wifi" />
        <Label htmlFor="thumb-switch-wifi">Wi-Fi</Label>
      </div>
    </div>
  ),
  table: () => (
    <Table className="w-60 text-xs">
      <TableHeader>
        <TableRow>
          <TableHead className="h-8">Invoice</TableHead>
          <TableHead className="h-8">Status</TableHead>
          <TableHead className="h-8 text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          ["INV001", "Paid", "$250.00"],
          ["INV002", "Pending", "$150.00"],
          ["INV003", "Unpaid", "$350.00"],
        ].map(([invoice, status, amount]) => (
          <TableRow key={invoice}>
            <TableCell className="py-1.5 font-medium">{invoice}</TableCell>
            <TableCell className="py-1.5">{status}</TableCell>
            <TableCell className="py-1.5 text-right">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  tabs: () => (
    <Tabs className="w-56" defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent className="flex flex-col gap-2" value="account">
        <Label htmlFor="thumb-tabs-name">Name</Label>
        <Input defaultValue="Jordan Lee" id="thumb-tabs-name" />
      </TabsContent>
    </Tabs>
  ),
  textarea: () => (
    <div className="flex w-56 flex-col gap-2">
      <Textarea placeholder="Type your message here." />
      <Button size="sm">Send message</Button>
    </div>
  ),
  toggle: () => (
    <div className="flex gap-2">
      <Toggle aria-label="Bold" defaultPressed>
        <Bold />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <Italic />
      </Toggle>
      <Toggle aria-label="Underline">
        <Underline />
      </Toggle>
    </div>
  ),
  "toggle-group": () => (
    <ToggleGroup defaultValue={["bold"]} type="multiple" variant="outline">
      <ToggleGroupItem aria-label="Bold" value="bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Italic" value="italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Underline" value="underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  tooltip: () => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-fit rounded-tooltip bg-foreground px-3 py-1.5 text-background text-xs">
        Add to library
        <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-tooltip-arrow bg-foreground" />
      </div>
      <Button variant="outline">Hover</Button>
    </div>
  ),
};

/** Whether a component page has a live preview for its overview card. */
export function hasComponentThumbnail(slug: string) {
  return slug in THUMBNAILS;
}

/**
 * The live preview for a component's overview card. It is inert: nothing in
 * it takes focus or clicks, so the card's link handles both.
 */
export function ComponentThumbnail({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Thumbnail = THUMBNAILS[slug];
  if (!Thumbnail) {
    return null;
  }
  return (
    <div
      aria-hidden="true"
      className={cn(
        "@container flex aspect-4/3 w-full select-none items-center justify-center overflow-hidden",
        className,
      )}
      inert
    >
      <div className="flex h-[225px] w-[300px] shrink-0 @min-[180px]:scale-60 @min-[200px]:scale-[0.66] @min-[220px]:scale-[0.73] @min-[240px]:scale-80 @min-[260px]:scale-[0.86] @min-[280px]:scale-[0.93] @min-[300px]:scale-100 scale-[0.55] items-center justify-center">
        <Thumbnail />
      </div>
    </div>
  );
}
