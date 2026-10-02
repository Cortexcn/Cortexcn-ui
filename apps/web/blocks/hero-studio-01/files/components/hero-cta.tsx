import { cva, type VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonVariant = NonNullable<ButtonVariants["variant"]>;

export interface CtaProps {
  ctaEnabled?: boolean;
  text: string;
  /** Leave empty to render a button instead of a link. */
  link: string;
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg";
}

const ctaVariants = cva("w-fit rounded-full px-4", {
  variants: {
    invert: {
      true: "border-transparent! bg-white! text-zinc-900! hover:bg-zinc-100!",
      false: "",
    },
  },
  defaultVariants: {
    invert: false,
  },
});

export function Cta({
  cta,
  className,
  invert,
}: Readonly<{ cta?: CtaProps; className?: string; invert?: boolean }>) {
  if (!cta?.ctaEnabled) {
    return null;
  }

  const variant = cta.variant ?? (invert ? "secondary" : "default");

  if (!cta.link) {
    return (
      <Button
        aria-label={cta.text}
        className={cn(ctaVariants({ invert }), className)}
        size={cta.size ?? "default"}
        type="button"
        variant={variant}
      >
        {cta.text}
      </Button>
    );
  }

  return (
    // No aria-label here, so screen readers also hear "(opens in new tab)".
    <a
      className={cn(
        buttonVariants({
          variant,
          size: cta.size ?? "default",
          className: cn(ctaVariants({ invert }), className),
        }),
      )}
      href={cta.link}
      rel="noopener noreferrer"
      target="_blank"
    >
      {cta.text}
      <span className="sr-only">{`${cta.text} (opens in new tab)`}</span>
    </a>
  );
}
