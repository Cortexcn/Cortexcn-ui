"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Skips movement for visitors who ask for reduced motion while fades still
 * play. Deciding this in MotionConfig, not per component, keeps the server
 * and client markup identical.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
