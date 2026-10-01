"use client";

import {
  BookOpenIcon,
  CodeIcon,
  ImageIcon,
  RotateCcwIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../components/button";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "../components/chain-of-thought";

const regionRevenue = [
  { region: "North", revenue: 182 },
  { region: "South", revenue: 146 },
  { region: "East", revenue: 121 },
  { region: "West", revenue: 97 },
];

export function ChainOfThoughtDemo() {
  const peak = Math.max(...regionRevenue.map((row) => row.revenue));

  return (
    <ChainOfThought className="max-w-md" defaultOpen>
      <ChainOfThoughtHeader>
        Picking a chart for revenue by region
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          icon={SearchIcon}
          label="Searching the registry for chart components"
        >
          <ChainOfThoughtSearchResults>
            <ChainOfThoughtSearchResult>bar-chart</ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>area-chart</ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>ring-chart</ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>
              composed-chart
            </ChainOfThoughtSearchResult>
          </ChainOfThoughtSearchResults>
        </ChainOfThoughtStep>

        <ChainOfThoughtStep
          description="Four regions is a short list, so bars compare them better than slices."
          icon={BookOpenIcon}
          label="Reading the Bar Chart docs"
        />

        <ChainOfThoughtStep icon={ImageIcon} label="Sketching a preview">
          <ChainOfThoughtImage caption="Revenue by region, Q3, in thousands of dollars">
            <div className="flex h-32 w-full items-end gap-3">
              {regionRevenue.map((row) => (
                <div
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                  key={row.region}
                >
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    {row.revenue}
                  </span>
                  <div
                    className="w-full rounded-sm bg-foreground/80"
                    style={{ height: `${(row.revenue / peak) * 72}%` }}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {row.region}
                  </span>
                </div>
              ))}
            </div>
          </ChainOfThoughtImage>
        </ChainOfThoughtStep>

        <ChainOfThoughtStep
          description="npx shadcn@latest add @cortexcn/bar-chart"
          icon={CodeIcon}
          label="Installing the component"
          status="active"
        />

        <ChainOfThoughtStep
          icon={ShieldCheckIcon}
          label="Checking the types"
          status="pending"
        />
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

const liveSteps = [
  {
    icon: SearchIcon,
    label: "Searching for the refund policy",
    sources: ["help-center/refunds", "terms#payments"],
  },
  {
    icon: BookOpenIcon,
    label: "Reading the order history",
    description: "Order 4471 shipped 12 days ago, inside the 30 day window.",
  },
  {
    icon: ShieldCheckIcon,
    label: "Checking the refund rules",
    description: "Unopened items qualify for a full refund.",
  },
  {
    icon: CodeIcon,
    label: "Drafting the reply",
  },
];

const STEP_INTERVAL_MS = 1400;

export function ChainOfThoughtLive() {
  const [run, setRun] = useState(0);
  const [stage, setStage] = useState(0);
  const done = stage >= liveSteps.length;

  useEffect(() => {
    if (done) {
      return;
    }
    const timer = setTimeout(
      () => setStage((value) => value + 1),
      STEP_INTERVAL_MS,
    );
    return () => clearTimeout(timer);
  }, [done, stage]);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4">
      <ChainOfThought defaultOpen key={run}>
        <ChainOfThoughtHeader>
          {done
            ? `Worked through ${liveSteps.length} steps`
            : "Working on the refund request"}
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {liveSteps.slice(0, stage + 1).map((step, index) => (
            <ChainOfThoughtStep
              description={step.description}
              icon={step.icon}
              key={step.label}
              label={step.label}
              status={index < stage ? "complete" : "active"}
            >
              {step.sources ? (
                <ChainOfThoughtSearchResults>
                  {step.sources.map((source) => (
                    <ChainOfThoughtSearchResult key={source}>
                      {source}
                    </ChainOfThoughtSearchResult>
                  ))}
                </ChainOfThoughtSearchResults>
              ) : null}
            </ChainOfThoughtStep>
          ))}
        </ChainOfThoughtContent>
      </ChainOfThought>
      <Button
        disabled={!done}
        onClick={() => {
          setStage(0);
          setRun((value) => value + 1);
        }}
        size="sm"
        variant="outline"
      >
        <RotateCcwIcon />
        Run again
      </Button>
    </div>
  );
}
