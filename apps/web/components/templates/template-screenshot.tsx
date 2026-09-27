import Image from "next/image";
import type { ThemedImage } from "@/lib/site-templates";
import { cn } from "@/lib/utils";

/**
 * The light or dark capture of a template, following the site theme. The
 * hidden one is lazy, so a visitor only downloads the one they can see.
 */
export function TemplateScreenshot({
  alt,
  className,
  image,
  sizes,
}: {
  alt: string;
  className?: string;
  image: ThemedImage;
  sizes: string;
}) {
  return (
    <>
      <Image
        alt={alt}
        className={cn("h-auto w-full dark:hidden", className)}
        placeholder="blur"
        sizes={sizes}
        src={image.light}
      />
      <Image
        alt={alt}
        className={cn("hidden h-auto w-full dark:block", className)}
        placeholder="blur"
        sizes={sizes}
        src={image.dark}
      />
    </>
  );
}
