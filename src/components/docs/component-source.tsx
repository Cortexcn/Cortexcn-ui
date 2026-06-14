import { promises as fs } from "node:fs";
import path from "node:path";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

// Reads a registry component's source from disk and renders it as a code block.
// Used in the "Manual" installation step.
export async function ComponentSource({
  name,
  title,
}: {
  name: string;
  title?: string;
}) {
  // Canonical components live in registry/ui/<name>/<name>.tsx; others
  // (installed via the shadcn CLI) live directly in components/ui/<name>.tsx.
  const candidates = [
    path.join(process.cwd(), "src", "registry", "ui", name, `${name}.tsx`),
    path.join(process.cwd(), "src", "components", "ui", `${name}.tsx`),
  ];

  let code: string | undefined;
  for (const file of candidates) {
    try {
      code = await fs.readFile(file, "utf-8");
      break;
    } catch {
      // try next candidate
    }
  }

  if (code === undefined) {
    return (
      <p className="text-sm text-fd-muted-foreground">
        Source for <code>{name}</code> not found.
      </p>
    );
  }

  return (
    <DynamicCodeBlock
      lang="tsx"
      code={code}
      codeblock={{ title: title ?? `components/ui/${name}.tsx` }}
    />
  );
}
