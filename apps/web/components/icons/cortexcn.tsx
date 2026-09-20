import Image from "next/image";

import { cn } from "@/lib/utils";

interface CortexcnLogoProps {
  className?: string;
  size?: number;
  /** Which mark to render. Light theme uses the dark mark on a light tile, and vice versa. */
  theme?: "light" | "dark";
}

/** Cortexcn brand mark, rendered as a rounded tile that suits the active theme. */
export function CortexcnLogo({
  className,
  size = 24,
  theme = "dark",
}: CortexcnLogoProps) {
  const src =
    theme === "dark"
      ? "/img/cortexcn/icon-dark.png"
      : "/img/cortexcn/icon-light.png";

  return (
    <Image
      alt="Cortexcn"
      className={cn("rounded-[6px] object-cover", className)}
      height={size}
      priority
      src={src}
      unoptimized
      width={size}
    />
  );
}
