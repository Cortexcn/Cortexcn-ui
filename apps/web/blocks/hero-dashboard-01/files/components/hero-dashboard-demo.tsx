import {
  Activity,
  BarChart3,
  Bell,
  LayoutGrid,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: Users, label: "Customers", active: false },
  { icon: Activity, label: "Activity", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const stats = [
  { label: "Revenue", value: "$48.2k", trend: "+12.4%", up: true },
  { label: "Active users", value: "2,318", trend: "+4.1%", up: true },
  { label: "Conversion", value: "3.6%", trend: "+0.8%", up: true },
  { label: "Churn", value: "1.4%", trend: "-2.0%", up: false },
];

const bars = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 36 },
  { month: "Apr", value: 64 },
  { month: "May", value: 48 },
  { month: "Jun", value: 72 },
  { month: "Jul", value: 55 },
  { month: "Aug", value: 80 },
  { month: "Sep", value: 61 },
  { month: "Oct", value: 88 },
  { month: "Nov", value: 70 },
  { month: "Dec", value: 94 },
];

const activity = [
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&q=80",
    name: "James Doe",
    action: "upgraded to Pro",
    time: "2m",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&q=80",
    name: "Sara Lin",
    action: "invited 3 members",
    time: "18m",
  },
  {
    src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&q=80",
    name: "Marcus Vale",
    action: "connected Stripe",
    time: "1h",
  },
];

/** A sample analytics app in a browser window, for the hero's media slot. */
export function DashboardDemo() {
  return (
    <div className="relative w-full max-w-4xl">
      <Card className="w-full gap-0 overflow-hidden bg-card p-0 shadow-2xl outline outline-black/10 dark:outline-white/10">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b px-3 py-2.5">
          <div className="flex shrink-0 gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <div className="mx-auto flex h-6 w-full min-w-0 max-w-56 items-center gap-1.5 rounded-md bg-muted px-2 text-[10px] text-muted-foreground">
            <Search className="size-3 shrink-0" />
            <span className="truncate">app.acme.com/overview</span>
          </div>
          <Avatar className="size-6 shrink-0">
            <AvatarImage
              alt=""
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&q=80"
            />
            <AvatarFallback className="text-[9px]">JD</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden w-44 shrink-0 flex-col gap-1 border-r p-3 sm:flex">
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="size-6 rounded-lg bg-primary/85" />
              <span className="font-semibold text-sm tracking-tight">Acme</span>
            </div>
            {nav.map(({ icon: Icon, label, active }) => (
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
                  active
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground",
                )}
                key={label}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 sm:p-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate font-semibold text-sm tracking-tight">
                  Overview
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  Last 30 days · updated 2m ago
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {/* Hidden on phones so the page title keeps its room. */}
                <Button className="max-sm:hidden" size="xs" variant="outline">
                  Export
                </Button>
                <Button size="xs">New report</Button>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  className="min-w-0 rounded-lg border p-2.5"
                  key={stat.label}
                >
                  <span className="block truncate text-[9px] text-muted-foreground">
                    {stat.label}
                  </span>
                  <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-1">
                    <span className="font-semibold text-sm tabular-nums">
                      {stat.value}
                    </span>
                    <span
                      className={cn(
                        "font-medium text-[9px] tabular-nums",
                        stat.up
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500 dark:text-red-400",
                      )}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-medium text-xs">
                    Monthly revenue
                  </span>
                  <span className="truncate text-[9px] text-muted-foreground">
                    $48,240 total
                  </span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[9px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary/80" />
                  This year
                </span>
              </div>

              <div className="mt-3 flex h-20 items-end gap-1.5">
                {bars.map((bar) => (
                  <div
                    className="min-h-0.5 flex-1 rounded-sm bg-primary/70"
                    key={bar.month}
                    style={{ height: `${bar.value}%` }}
                    title={`${bar.month}: ${bar.value}`}
                  />
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs">Recent activity</span>
                <Badge className="text-[9px]" variant="secondary">
                  Live
                </Badge>
              </div>
              <div className="mt-2 flex flex-col">
                {activity.map((entry, index) => (
                  <div key={entry.name}>
                    {index > 0 && <Separator className="my-2" />}
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6 shrink-0">
                        <AvatarImage alt="" src={entry.src} />
                        <AvatarFallback className="text-[9px]">
                          {entry.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1 truncate text-[11px]">
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {entry.action}
                        </span>
                      </span>
                      <span className="shrink-0 text-[9px] text-muted-foreground tabular-nums">
                        {entry.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating notification */}
      <div className="absolute right-1 bottom-1 max-w-[calc(100%-0.5rem)] sm:-right-4 sm:-bottom-4">
        <Card className="flex-row items-center gap-2.5 p-2.5 shadow-lg">
          <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium text-xs leading-tight">
              Payment received
            </span>
            <span className="truncate text-[10px] text-muted-foreground leading-tight">
              $1,290 from Acme Inc.
            </span>
          </div>
          <Badge className="ml-1 shrink-0 text-[10px]" variant="secondary">
            +$1.2k
          </Badge>
        </Card>
      </div>
    </div>
  );
}
