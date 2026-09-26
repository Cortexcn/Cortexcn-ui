"use client";

import { Icon } from "@bklitui/icons";
import {
  startThemeTransition,
  THEME_TOGGLE_EFFECTS,
  type ThemeToggleEffect,
} from "@bklitui/ui/components/theme-toggle-effect";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeToggleEffectDemo() {
  const { resolvedTheme, setTheme } = useTheme();
  const [effect, setEffect] = useState<ThemeToggleEffect>("circle");
  const [mounted, setMounted] = useState(false);

  // resolvedTheme is only known on the client; avoid a mismatched icon.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    startThemeTransition(() => setTheme(isDark ? "light" : "dark"), effect);
  };

  return (
    <div className="flex items-center gap-2 py-10">
      <Select
        onValueChange={(value) => setEffect(value as ThemeToggleEffect)}
        value={effect}
      >
        <SelectTrigger aria-label="Effect" className="w-52 cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEME_TOGGLE_EFFECTS.map((name) => (
            <SelectItem className="cursor-pointer" key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className="cursor-pointer"
        onClick={toggleTheme}
        size="icon"
        variant="outline"
      >
        <Icon className="size-4" name={isDark ? "IconSun" : "IconMoon"} />
      </Button>
    </div>
  );
}
