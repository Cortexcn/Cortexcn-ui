"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STORAGE_KEY = "cortexcn-install-type";

export type InstallTab = "cli" | "manual" | "mcp";

const INSTALL_TABS: InstallTab[] = ["cli", "manual", "mcp"];

function isInstallTab(value: string | null): value is InstallTab {
  return INSTALL_TABS.includes(value as InstallTab);
}

interface CodeTabsProps {
  children: ReactNode;
  defaultValue?: InstallTab;
  onTabChange?: (tab: InstallTab) => void;
}

export function CodeTabs({
  children,
  defaultValue = "cli",
  onTabChange,
}: CodeTabsProps) {
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isInstallTab(stored)) {
      setValue(stored);
      onTabChange?.(stored);
    }
  }, [onTabChange]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    localStorage.setItem(STORAGE_KEY, newValue);
    if (isInstallTab(newValue)) {
      onTabChange?.(newValue);
    }
  };

  return (
    <Tabs className="mt-6" onValueChange={handleValueChange} value={value}>
      <TabsList variant="line">
        <TabsTrigger value="cli">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
        <TabsTrigger value="mcp">MCP</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export function CodeTabsContent({
  value,
  children,
}: {
  value: InstallTab;
  children: ReactNode;
}) {
  return <TabsContent value={value}>{children}</TabsContent>;
}
