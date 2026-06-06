"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Toggle } from "@/components/ui/toggle";

export default function ToggleDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Toggle
      variant="outline"
      aria-label="Toggle dark mode"
      pressed={isDark}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      {isDark ? "Dark" : "Light"}
    </Toggle>
  );
}
