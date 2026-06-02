"use client";

import { motion, useMotionValue, useSpring } from "motion/react";

const VIEWBOX_WIDTH = 1410;
const VIEWBOX_HEIGHT = 258;
const DEFAULT_GRADIENT_X = VIEWBOX_WIDTH / 2;

export function SiteFooterInteractiveLogotype() {
  const gradientX1Raw = useMotionValue(DEFAULT_GRADIENT_X);
  const gradientX1 = useSpring(gradientX1Raw, {
    stiffness: 200,
    damping: 30,
    mass: 0.5,
  });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const containerRect = container.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const containerWidth = containerRect.width;

    const normalizedX = (mouseX / containerWidth) * VIEWBOX_WIDTH;
    const clampedX = Math.max(0, Math.min(VIEWBOX_WIDTH, normalizedX));

    gradientX1Raw.set(clampedX);
  };

  const handleMouseLeave = () => {
    gradientX1Raw.set(DEFAULT_GRADIENT_X);
  };

  const text = "cortexcn";
  const fontFamily = "var(--font-doto)";
  const textLength = VIEWBOX_WIDTH * 0.92;

  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex w-full translate-y-[37.5%] items-center justify-center">
          <svg
            className="container size-full"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              textLength={textLength}
              lengthAdjust="spacingAndGlyphs"
              fontSize="240"
              fontWeight="700"
              style={{ fontFamily }}
              fill="none"
              className="stroke-foreground/10"
              strokeWidth="2"
            >
              {text}
            </text>
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="central"
              textLength={textLength}
              lengthAdjust="spacingAndGlyphs"
              fontSize="240"
              fontWeight="700"
              style={{ fontFamily }}
              fill="url(#paint0_linear_logotype)"
            >
              {text}
            </text>
            <defs>
              <motion.linearGradient
                id="paint0_linear_logotype"
                x1={gradientX1}
                y1="1"
                x2={VIEWBOX_WIDTH / 2}
                y2={VIEWBOX_HEIGHT - 1}
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--foreground)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
