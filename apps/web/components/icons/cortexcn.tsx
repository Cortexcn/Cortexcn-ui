import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_SRC = {
  light: "/img/cortexcn/icon-light.png",
  dark: "/img/cortexcn/icon-dark.png",
} as const;

interface CortexcnLogoProps {
  className?: string;
  size?: number;
  /**
   * Which mark to render. Light theme uses the dark mark on a light tile, and vice versa.
   * "auto" follows the nearest `dark` scope through CSS, so it needs no client theme state.
   */
  theme?: "light" | "dark" | "auto";
}

/** Cortexcn brand mark, rendered as a rounded tile that suits the active theme. */
export function CortexcnLogo({
  className,
  size = 24,
  theme = "dark",
}: CortexcnLogoProps) {
  if (theme === "auto") {
    return (
      <>
        <CortexcnLogo
          className={cn("dark:hidden", className)}
          size={size}
          theme="light"
        />
        <CortexcnLogo
          className={cn("hidden dark:block", className)}
          size={size}
          theme="dark"
        />
      </>
    );
  }

  return (
    <Image
      alt="Cortexcn"
      className={cn("rounded-[6px] object-cover", className)}
      height={size}
      priority
      src={LOGO_SRC[theme]}
      unoptimized
      width={size}
    />
  );
}
