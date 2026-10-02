"use client";

import { Icon, type IconName } from "@cortexcn/icons";
import {
  FanOutDiagram,
  type FanOutNode,
} from "@cortexcn/ui/components/fan-out-diagram";

/** Central icons drawn in the diagram's 24 by 24 icon box. */
const icon = (name: IconName) => <Icon name={name} size={24} />;

/** The Cortexcn mark, as SVG images so it can sit inside the diagram. */
const cortexcnMark = (
  <>
    <image
      className="dark:hidden"
      height="24"
      href="/img/cortexcn/icon-light.png"
      width="24"
    />
    <image
      className="hidden dark:block"
      height="24"
      href="/img/cortexcn/icon-dark.png"
      width="24"
    />
  </>
);

const SANDBOXES: FanOutNode[] = [
  {
    label: "Sandbox 1",
    meta: "Claude Code",
    icon: icon("IconConsole"),
    status: "running",
  },
  {
    label: "Sandbox 2",
    meta: "Codex",
    icon: icon("IconCode"),
    status: "running",
  },
  {
    label: "Sandbox 3",
    meta: "Browser agent",
    icon: icon("IconGlobe"),
    status: "running",
  },
  {
    label: "Sandbox 4",
    meta: "Custom",
    icon: icon("IconLayersTwo"),
    status: "starting",
  },
  {
    label: "Sandbox 5",
    meta: "Data agent",
    icon: icon("IconStorage"),
    status: "running",
  },
  {
    label: "Sandbox 6",
    meta: "Claude Code",
    icon: icon("IconConsole"),
    status: "running",
  },
  {
    label: "Sandbox 7",
    meta: "Custom",
    icon: icon("IconLayersTwo"),
    status: "stopped",
  },
];

export function FanOutDiagramDemo({ animated = true }: { animated?: boolean }) {
  return (
    <FanOutDiagram
      animated={animated}
      hubIcon={cortexcnMark}
      nodes={SANDBOXES}
      source={{ label: "Your app", icon: icon("IconWindowApp") }}
      title="Agent platform"
      titleIcon={cortexcnMark}
    />
  );
}

export function FanOutDiagramQueueDemo() {
  return (
    <FanOutDiagram
      hubIcon={icon("IconNumberedList")}
      nodes={[
        {
          label: "Worker 1",
          meta: "invoices",
          icon: icon("IconServer"),
          status: "running",
        },
        {
          label: "Worker 2",
          meta: "emails",
          icon: icon("IconServer"),
          status: "running",
        },
        {
          label: "Worker 3",
          meta: "refunds",
          icon: icon("IconServer"),
          status: "error",
          statusLabel: "retrying",
        },
      ]}
      source={{ label: "Webhooks", icon: icon("IconLightning") }}
      title="Job queue"
    />
  );
}
