"use client";

import {
  THEME_TOGGLE_EFFECTS,
  type ThemeToggleEffect,
} from "@bklitui/ui/components/theme-toggle-effect";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { CodeTabs } from "./code-tabs";
import {
  CodeFileBlock,
  type RegistryData,
  type RegistryFile,
  registryGlobalCss,
} from "./installation-tabs";
import { PackageManagerTabs } from "./package-manager-tabs";

const EFFECT_LABELS: Record<ThemeToggleEffect, string> = {
  triangle: "Triangle",
  "triangle-blur": "Triangle blur",
  circle: "Circle",
  "circle-blur": "Circle blur",
  "circle-blur-top-left": "Circle blur (top left)",
  polygon: "Polygon",
  "polygon-gradient": "Polygon gradient",
};

const effectItemName = (effect: ThemeToggleEffect) =>
  `theme-toggle-effect-${effect}`;

async function fetchRegistryItem(name: string): Promise<RegistryData | null> {
  try {
    const res = await fetch(`/r/${name}.json`);
    return res.ok ? ((await res.json()) as RegistryData) : null;
  } catch {
    return null;
  }
}

/**
 * One install command per effect (each ships the helper plus only that
 * effect's CSS), and a manual path that shows the same files and CSS.
 */
export function ThemeToggleEffectInstallation() {
  const [tab, setTab] = useState<"cli" | "manual">("cli");
  const [helperFile, setHelperFile] = useState<RegistryFile | null>(null);
  const [effectCss, setEffectCss] = useState<
    Partial<Record<ThemeToggleEffect, string>>
  >({});

  useEffect(() => {
    if (tab !== "manual" || helperFile) {
      return;
    }

    let cancelled = false;
    Promise.all([
      fetchRegistryItem("theme-toggle-effect"),
      ...THEME_TOGGLE_EFFECTS.map((effect) =>
        fetchRegistryItem(effectItemName(effect)),
      ),
    ]).then(([helper, ...effects]) => {
      if (cancelled) {
        return;
      }
      setHelperFile(helper?.files[0] ?? null);
      setEffectCss(
        Object.fromEntries(
          THEME_TOGGLE_EFFECTS.map((effect, index) => {
            const item = effects[index];
            return [effect, item ? registryGlobalCss(item) : ""];
          }),
        ),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [tab, helperFile]);

  return (
    <CodeTabs onTabChange={setTab}>
      <TabsContent value="cli">
        <p>
          Pick one effect. Each command installs the helper and that
          effect&apos;s CSS.
        </p>
        {THEME_TOGGLE_EFFECTS.map((effect) => (
          <div key={effect}>
            <h3>{EFFECT_LABELS[effect]}</h3>
            <PackageManagerTabs name={effectItemName(effect)} />
          </div>
        ))}
      </TabsContent>
      <TabsContent value="manual">
        <div className="mt-4">
          <Steps>
            <Step>
              <h4 className="font-medium">
                Copy the helper into your project.
              </h4>
              <div className="mt-3">
                {helperFile ? (
                  <CodeFileBlock file={helperFile} />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Loading component source...
                  </p>
                )}
              </div>
            </Step>
            <Step>
              <h4 className="font-medium">
                Add the CSS for one effect to your globals.css.
              </h4>
              <div className="mt-3 space-y-4">
                {THEME_TOGGLE_EFFECTS.map((effect) => (
                  <div key={effect}>
                    <p className="mt-0 mb-2 font-medium text-sm">
                      {EFFECT_LABELS[effect]}
                    </p>
                    <CodeFileBlock
                      file={{
                        path: "globals.css",
                        content: effectCss[effect] ?? "",
                        type: "registry:style",
                        target: "app/globals.css",
                      }}
                    />
                  </div>
                ))}
              </div>
            </Step>
            <Step>
              <h4 className="font-medium">
                Update the import paths to match your project setup.
              </h4>
            </Step>
          </Steps>
        </div>
      </TabsContent>
    </CodeTabs>
  );
}
