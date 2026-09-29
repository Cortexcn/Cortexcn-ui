"use client";

// Adapted from the shadcn/ui Aspect Ratio (MIT, https://ui.shadcn.com).
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
