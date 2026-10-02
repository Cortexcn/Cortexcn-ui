"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { CortexcnLogo } from "@/components/icons/cortexcn";
import {
  type PackageManager,
  PackageManagerIcon,
} from "@/components/icons/package-manager-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { codeThemes } from "@/lib/code-theme";
import { shadcnAddItem } from "@/lib/registry-links";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cortexcn-package-manager";

const PM_SHADCN_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "npx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
};

const PM_ADD_COMMANDS: Record<PackageManager, string> = {
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
  bun: "bun add",
};

interface PackageManagerTabsProps {
  name: string;
  /** Pass `name` to `shadcn add` as-is, e.g. for shadcn/ui's own components. */
  raw?: boolean;
}

export function PackageManagerTabs({
  name,
  raw = false,
}: PackageManagerTabsProps) {
  const [pm, setPm] = useState<PackageManager>("pnpm");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as PackageManager | null;
    if (stored && PM_SHADCN_COMMANDS[stored]) {
      setPm(stored);
    }
  }, []);

  const handleValueChange = (newValue: string) => {
    setPm(newValue as PackageManager);
    localStorage.setItem(STORAGE_KEY, newValue);
  };

  const isDepsOnly = name.startsWith("__deps:");
  const depsString = isDepsOnly ? name.replace("__deps:", "") : "";

  const getCommand = (manager: PackageManager) => {
    if (isDepsOnly) {
      return `${PM_ADD_COMMANDS[manager]} ${depsString}`;
    }
    return `${PM_SHADCN_COMMANDS[manager]} ${raw ? name : shadcnAddItem(name)}`;
  };

  const command = getCommand(pm);

  return (
    <figure className="not-prose relative my-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Tabs onValueChange={handleValueChange} value={pm}>
        <div className="flex items-center gap-2 border-border border-b bg-muted/40 px-3 py-1.5">
          <CortexcnLogo className="rounded-[3px]" size={16} theme="auto" />
          <TabsList
            className="h-auto gap-0 rounded-none bg-transparent p-0"
            variant="line"
          >
            {(["pnpm", "npm", "yarn", "bun"] as const).map((manager) => (
              <TabsTrigger
                className={cn(
                  "h-7 border border-transparent px-2 pt-0.5 shadow-none",
                  "data-[state=active]:border-border data-[state=active]:bg-background",
                )}
                key={manager}
                value={manager}
              >
                <PackageManagerIcon manager={manager} />
                {manager}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="overflow-x-auto">
          {(["pnpm", "npm", "yarn", "bun"] as const).map((manager) => (
            <TabsContent className="mt-0" key={manager} value={manager}>
              <DynamicCodeBlock
                code={getCommand(manager)}
                codeblock={{
                  allowCopy: false,
                  className:
                    "my-0 rounded-none border-0 bg-transparent [&_pre]:bg-transparent",
                }}
                lang="bash"
                options={{ themes: codeThemes }}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <CopyButton className="absolute top-2 right-2 z-10" text={command} />
    </figure>
  );
}
