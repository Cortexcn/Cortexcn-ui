import { promises as fs } from "node:fs";
import path from "node:path";

import { Index } from "@/registry/__index__";

import { ComponentPreviewTabs } from "./component-preview-tabs";

// Server component: reads the example source from disk, then hands the live
// preview + code off to the client tabs component.
export async function ComponentPreview({ name }: { name: string }) {
  const entry = Index[name];

  if (!entry) {
    return (
      <p className="text-sm text-fd-muted-foreground">
        Unknown preview: <code>{name}</code>
      </p>
    );
  }

  const code = await fs.readFile(path.join(process.cwd(), entry.file), "utf-8");

  return <ComponentPreviewTabs name={name} code={code} />;
}
