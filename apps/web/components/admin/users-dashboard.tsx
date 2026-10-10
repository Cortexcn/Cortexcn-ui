"use client";

import {
  Bar,
  BarChart,
  BarXAxis,
  ChartTooltip,
  Grid,
} from "@cortexcn/ui/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@cortexcn/ui/components/table";
import type { FunctionReturnType } from "convex/server";
import { useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { api } from "@/convex/_generated/api";

type Overview = NonNullable<FunctionReturnType<typeof api.admin.overview>>;
type AdminUser = Overview["users"][number];

const PROVIDER_LABELS: Record<string, string> = {
  google: "Google",
  credential: "Email",
};

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
/** Chart buckets are UTC days, so their labels are too. */
const dayLabelFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000_000],
  ["month", 2_592_000_000],
  ["week", 604_800_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** "3 hours ago", measured from when the data was read, so it renders the same twice. */
function timeAgo(time: number, now: number) {
  const elapsed = time - now;
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(elapsed) >= size) {
      return relativeFormat.format(Math.round(elapsed / size), unit);
    }
  }
  return "just now";
}

const WHITESPACE_RE = /\s+/;

function initials(name: string) {
  return (
    name
      .split(WHITESPACE_RE)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-semibold text-3xl tabular-nums">
          {value.toLocaleString("en-US")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-xs">
        {detail}
      </CardContent>
    </Card>
  );
}

function SignupsChart({ data }: { data: Overview["signupsByDay"] }) {
  const chartData = useMemo(
    () =>
      data.map((entry) => ({
        day: dayLabelFormat.format(new Date(`${entry.day}T00:00:00Z`)),
        signups: entry.signups,
      })),
    [data],
  );
  const total = data.reduce((sum, entry) => sum + entry.signups, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign-ups</CardTitle>
        <CardDescription>
          {total.toLocaleString("en-US")} in the last 30 days, by UTC day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <BarChart data={chartData} xDataKey="day">
            <Grid horizontal />
            <Bar dataKey="signups" fill="var(--chart-1)" lineCap={3} />
            <BarXAxis maxLabels={6} />
            <ChartTooltip />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}

function UserRow({ user, now }: { user: AdminUser; now: number }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {user.image ? (
              <AvatarImage
                alt=""
                referrerPolicy="no-referrer"
                src={user.image}
              />
            ) : null}
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-muted-foreground text-xs">
              {user.email}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {user.providers.length > 0 ? (
            user.providers.map((provider) => (
              <Badge key={provider} variant="outline">
                {PROVIDER_LABELS[provider] ?? provider}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">None</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <time
          dateTime={new Date(user.createdAt).toISOString()}
          suppressHydrationWarning
          title={dateTimeFormat.format(user.createdAt)}
        >
          {dateFormat.format(user.createdAt)}
        </time>
      </TableCell>
      <TableCell>
        {user.lastActiveAt === null ? (
          <span className="text-muted-foreground">Never</span>
        ) : (
          <time
            dateTime={new Date(user.lastActiveAt).toISOString()}
            suppressHydrationWarning
            title={dateTimeFormat.format(user.lastActiveAt)}
          >
            {timeAgo(user.lastActiveAt, now)}
          </time>
        )}
      </TableCell>
      <TableCell className="text-right tabular-nums">
        {user.activeSessions > 0 ? (
          <Badge variant="secondary">{user.activeSessions} active</Badge>
        ) : null}{" "}
        <span className="text-muted-foreground">of {user.sessions}</span>
      </TableCell>
    </TableRow>
  );
}

function UsersTable({ users, now }: { users: AdminUser[]; now: number }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const shown = query
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      )
    : users;

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle>All users</CardTitle>
          <CardDescription>
            Everyone who has signed in, newest first.
          </CardDescription>
        </div>
        <Input
          aria-label="Search users by name or email"
          className="sm:max-w-64"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or email"
          type="search"
          value={search}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Signed in with</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Sessions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((user) => (
              <UserRow key={user.id} now={now} user={user} />
            ))}
            {shown.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center text-muted-foreground"
                  colSpan={5}
                >
                  {users.length === 0
                    ? "No one has signed in yet."
                    : `No users match "${search.trim()}".`}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function UsersDashboard({ data }: { data: Overview }) {
  const { totals, generatedAt } = data;

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm">
          Everyone with a Cortexcn account. Updated{" "}
          <time
            dateTime={new Date(generatedAt).toISOString()}
            suppressHydrationWarning
          >
            {dateTimeFormat.format(generatedAt)}
          </time>
          ; reload for the latest.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          detail="Accounts created with any sign-in method"
          label="Total users"
          value={totals.users}
        />
        <StatCard
          detail="Joined in the last 7 days"
          label="New this week"
          value={totals.newThisWeek}
        />
        <StatCard
          detail="Signed in during the last 24 hours"
          label="Active today"
          value={totals.activeToday}
        />
        <StatCard
          detail="Sessions that have not expired"
          label="Active sessions"
          value={totals.activeSessions}
        />
      </div>

      <SignupsChart data={data.signupsByDay} />
      <UsersTable now={generatedAt} users={data.users} />
    </>
  );
}
