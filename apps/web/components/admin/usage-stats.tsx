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
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { api } from "@/convex/_generated/api";

type Stats = NonNullable<FunctionReturnType<typeof api.usage.stats>>;

const weekLabelFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

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

function WeeklyInstallsChart({ weekly }: { weekly: Stats["weekly"] }) {
  const data = useMemo(
    () =>
      weekly.map((entry) => ({
        week: weekLabelFormat.format(new Date(`${entry.week}T00:00:00Z`)),
        installs: entry.installs,
        installers: entry.installers,
      })),
    [weekly],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly installs</CardTitle>
        <CardDescription>
          Registry file requests per week, starting Monday (UTC)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <BarChart data={data} xDataKey="week">
            <Grid horizontal />
            <Bar dataKey="installs" fill="var(--chart-1)" lineCap={3} />
            <BarXAxis maxLabels={8} />
            <ChartTooltip />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}

function RankTable({
  title,
  description,
  nameLabel,
  rows,
}: {
  title: string;
  description: string;
  nameLabel: string;
  rows: Stats["topComponents"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground text-sm">
            Nothing logged yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>{nameLabel}</TableHead>
                <TableHead className="text-right">Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {row.name || "(none)"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.count.toLocaleString("en-US")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function WeeklyTable({ weekly }: { weekly: Stats["weekly"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>By week</CardTitle>
        <CardDescription>
          Unique counts use hashed IP addresses, so one office or VPN counts
          once.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week of</TableHead>
              <TableHead className="text-right">Installs</TableHead>
              <TableHead className="text-right">Unique installers</TableHead>
              <TableHead className="text-right">MCP calls</TableHead>
              <TableHead className="text-right">Unique MCP clients</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...weekly].reverse().map((entry) => (
              <TableRow key={entry.week}>
                <TableCell>
                  {weekLabelFormat.format(new Date(`${entry.week}T00:00:00Z`))}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.installs.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.installers.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.mcpCalls.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {entry.mcpClients.toLocaleString("en-US")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/** Registry installs and MCP calls, from the usage log. */
export function UsageStats({ data }: { data: Stats }) {
  const thisWeek = data.weekly.at(-1);
  const installsThisMonth = data.weekly
    .slice(-4)
    .reduce((sum, entry) => sum + entry.installs, 0);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-2xl tracking-tight">Stats</h1>
        <p className="text-muted-foreground text-sm">
          Requests to ui.cortexcn.dev/r/*.json and the MCP server. Updated{" "}
          <time
            dateTime={new Date(data.generatedAt).toISOString()}
            suppressHydrationWarning
          >
            {dateTimeFormat.format(data.generatedAt)}
          </time>
          ; reload for the latest.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          detail="Registry file requests since Monday (UTC)"
          label="Installs this week"
          value={thisWeek?.installs ?? 0}
        />
        <StatCard
          detail="Distinct hashed IPs since Monday"
          label="Unique installers this week"
          value={thisWeek?.installers ?? 0}
        />
        <StatCard
          detail="The last 4 weeks, for the home page proof strip"
          label="Installs, last 4 weeks"
          value={installsThisMonth}
        />
        <StatCard
          detail="MCP requests since Monday (UTC)"
          label="MCP calls this week"
          value={thisWeek?.mcpCalls ?? 0}
        />
      </div>

      <WeeklyInstallsChart weekly={data.weekly} />

      <div className="grid gap-4 lg:grid-cols-2">
        <RankTable
          description={`Most requested registry items, last ${data.topDays} days`}
          nameLabel="Component"
          rows={data.topComponents}
          title="Top 10 components"
        />
        <RankTable
          description={`Most used MCP tools and methods, last ${data.topDays} days`}
          nameLabel="Tool"
          rows={data.topTools}
          title="Top MCP tools"
        />
      </div>

      <WeeklyTable weekly={data.weekly} />

      {data.truncated ? (
        <p className="text-muted-foreground text-xs">
          The top lists hit their read limit, so they may undercount.
        </p>
      ) : null}
    </>
  );
}
