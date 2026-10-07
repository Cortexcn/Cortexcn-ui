"use client";

import { motion, useAnimation } from "motion/react";
import {
  type ComponentPropsWithoutRef,
  type Ref,
  useImperativeHandle,
} from "react";

export interface ChevronsUpDownIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface ChevronsUpDownIconProps
  extends ComponentPropsWithoutRef<"svg"> {
  ref?: Ref<ChevronsUpDownIconHandle>;
  duration?: number;
}

export function ChevronsUpDownIcon({
  ref,
  duration = 0.3,
  ...props
}: ChevronsUpDownIconProps) {
  const controls = useAnimation();

  useImperativeHandle(ref, () => {
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <motion.path
        animate={controls}
        d="M7 15L12 20L17 15"
        initial="normal"
        transition={{
          duration,
        }}
        variants={{
          normal: {
            d: "M7 15L12 20L17 15",
          },
          animate: {
            d: "M7 20L12 15L17 20",
          },
        }}
      />
      <motion.path
        animate={controls}
        d="M7 9L12 4L17 9"
        initial="normal"
        transition={{
          duration,
        }}
        variants={{
          normal: {
            d: "M7 9L12 4L17 9",
          },
          animate: {
            d: "M7 4L12 9L17 4",
          },
        }}
      />
    </svg>
  );
}
