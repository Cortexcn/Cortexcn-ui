/**
 * Code shown next to the UI component previews. Kept out of MDX because MDX
 * strips leading whitespace from multi-line JSX attributes, which flattens
 * anything that is not plain JSX (imports, function bodies).
 */

export const marqueeRowsCode = `<div className="relative flex w-full flex-col overflow-hidden">
  <Marquee pauseOnHover className="[--duration:30s]">
    {firstRow.map((logo) => (
      <LogoCard key={logo.name} {...logo} />
    ))}
  </Marquee>
  <Marquee reverse pauseOnHover className="[--duration:30s]">
    {secondRow.map((logo) => (
      <LogoCard key={logo.name} {...logo} />
    ))}
  </Marquee>
  <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background" />
  <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background" />
</div>`;

export const marqueeVerticalCode = `<div className="relative flex h-72 w-full items-center justify-center gap-4 overflow-hidden">
  <Marquee vertical pauseOnHover className="[--duration:20s]">
    {features.map((feature) => (
      <Card key={feature}>{feature}</Card>
    ))}
  </Marquee>
  <Marquee vertical reverse pauseOnHover className="[--duration:20s]">
    {features.map((feature) => (
      <Card key={feature}>{feature}</Card>
    ))}
  </Marquee>
</div>`;

export const lineNavControlledCode = `"use client";

import { useState } from "react";
import { LineNav } from "@/components/line-nav";

const items = [
  { title: "Introduction", href: "#introduction" },
  { title: "Installation", href: "#installation" },
  { title: "Usage", href: "#usage" },
  { title: "Examples", href: "#examples" },
  { title: "API Reference", href: "#api-reference" },
];

export function DocsNav() {
  const [activeHref, setActiveHref] = useState("#introduction");

  return (
    <LineNav
      items={items}
      activeHref={activeHref}
      scrollActiveIntoView={false}
      onItemClick={(item) => setActiveHref(item.href)}
    />
  );
}`;

export const logosCarouselRtlCode = `<LogosCarousel className="h-16" direction="rtl">
  {logos.map((logo) => (
    <Logo key={logo.name} {...logo} />
  ))}
</LogosCarousel>`;

export const logosCarouselColumnsCode = `<LogosCarousel className="h-16" columnCount={3}>
  {logos.map((logo) => (
    <Logo key={logo.name} {...logo} />
  ))}
</LogosCarousel>`;

export const themeToggleEffectDemoCode = `"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

import {
  startThemeTransition,
  THEME_TOGGLE_EFFECTS,
  type ThemeToggleEffect,
} from "@/components/theme-toggle-effect";
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
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Select
        value={effect}
        onValueChange={(value) => setEffect(value as ThemeToggleEffect)}
      >
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {THEME_TOGGLE_EFFECTS.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        onClick={() =>
          startThemeTransition(
            () => setTheme(isDark ? "light" : "dark"),
            effect,
          )
        }
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
}`;
