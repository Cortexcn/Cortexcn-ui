import Image from "next/image";

import { cn } from "@/lib/utils";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const ICON_DIR = "/img/package-managers";
const ICON_SIZE = 14;

interface IconAsset {
  src: string;
  darkSrc?: string;
  className?: string;
  width?: number;
}

// Only pnpm ships a separate dark file; its gray blocks disappear on dark backgrounds.
const ICONS: Record<PackageManager, IconAsset> = {
  pnpm: {
    src: `${ICON_DIR}/pnpm-light.svg`,
    darkSrc: `${ICON_DIR}/pnpm-dark.svg`,
  },
  // The npm mark is a wide wordmark, so it gets the full icon height and its own width.
  npm: { src: `${ICON_DIR}/npm.svg`, className: "h-3.5 w-8.5", width: 34 },
  yarn: { src: `${ICON_DIR}/yarn.svg` },
  bun: { src: `${ICON_DIR}/bun.svg` },
};

interface PackageManagerIconProps {
  manager: PackageManager;
  className?: string;
}

/** Decorative package manager mark; pair it with a visible text label. */
export function PackageManagerIcon({
  manager,
  className,
}: PackageManagerIconProps) {
  const icon = ICONS[manager];
  const { src, darkSrc, width = ICON_SIZE } = icon;
  const imageClassName = cn(
    "size-3.5 shrink-0 object-contain",
    icon.className,
    className,
  );

  if (!darkSrc) {
    return (
      <Image
        alt=""
        className={imageClassName}
        height={ICON_SIZE}
        src={src}
        unoptimized
        width={width}
      />
    );
  }

  return (
    <>
      <Image
        alt=""
        className={cn(imageClassName, "dark:hidden")}
        height={ICON_SIZE}
        src={src}
        unoptimized
        width={width}
      />
      <Image
        alt=""
        className={cn(imageClassName, "hidden dark:block")}
        height={ICON_SIZE}
        src={darkSrc}
        unoptimized
        width={width}
      />
    </>
  );
}
