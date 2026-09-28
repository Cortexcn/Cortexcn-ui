import type { ReactNode } from "react";

/** Shared frame for the line glyphs: a 24px grid stroked in the text color. */
function Glyph({
  className,
  strokeWidth = 1.8,
  children,
}: {
  className?: string;
  strokeWidth?: number;
  children: ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

interface IconProps {
  className?: string;
}

/* Tab icons */

export function DashboardsIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M6 19v-6M12 19V5M18 19v-9" />
    </Glyph>
  );
}

export function LandingPagesIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="16" rx="2.5" width="18" x="3" y="4" />
      <path d="M3 9h18M8.5 14h7" />
    </Glyph>
  );
}

export function PortfoliosIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="14" rx="2.5" width="18" x="3" y="5" />
      <circle cx="9" cy="10.5" r="2" />
      <path d="M6 16a3 3 0 0 1 6 0M15 10h3M15 14h3" />
    </Glyph>
  );
}

export function AppUiIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="16" rx="2.5" width="18" x="3" y="4" />
      <path d="M9 4v16M12.5 9h5M12.5 13h3" />
    </Glyph>
  );
}

/* Feature icons */

export function StatCardIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="16" rx="2.5" width="18" x="3" y="4" />
      <path d="m7 15 3-3 2.5 2L17 9.5" />
    </Glyph>
  );
}

export function PieIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M11 5a8 8 0 1 0 8 8h-8z" />
      <path d="M14 2.5v7.5h7.5A7.5 7.5 0 0 0 14 2.5z" />
    </Glyph>
  );
}

export function LayersIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16 8.5 4.5 8.5-4.5" />
    </Glyph>
  );
}

export function BlocksIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="7" rx="1.5" width="7" x="3.5" y="3.5" />
      <rect height="7" rx="1.5" width="7" x="13.5" y="3.5" />
      <rect height="7" rx="1.5" width="7" x="3.5" y="13.5" />
      <rect height="7" rx="1.5" width="7" x="13.5" y="13.5" />
    </Glyph>
  );
}

export function MarqueeIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="16" rx="2" width="10" x="7" y="4" />
      <path d="M3 7v10M21 7v10" />
    </Glyph>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M13 2.5 5 13.5h6.5l-1 8 8.5-11h-6.5z" />
    </Glyph>
  );
}

export function BriefcaseIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="13" rx="2.5" width="18" x="3" y="7" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18" />
    </Glyph>
  );
}

export function ContrastIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
    </Glyph>
  );
}

export function LineNavIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M4 7h5M4 12h12M4 17h5" />
    </Glyph>
  );
}

export function CommandIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M15 6.5v11a2.5 2.5 0 1 0 2.5-2.5h-11A2.5 2.5 0 1 0 9 17.5v-11A2.5 2.5 0 1 0 6.5 9h11A2.5 2.5 0 1 0 15 6.5" />
    </Glyph>
  );
}

export function QuestionIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.4v.4M12 16.8h.01" />
    </Glyph>
  );
}

export function StackedCardsIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <rect height="6" rx="1.5" width="17" x="3.5" y="3.5" />
      <rect height="8.5" rx="1.5" width="17" x="3.5" y="12" />
      <path d="M7 16.25h6" />
    </Glyph>
  );
}

/* Small glyphs inside the live windows */

export function SunIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </Glyph>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <Glyph className={className}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </Glyph>
  );
}

export function PenToolIcon({ className }: IconProps) {
  return (
    <Glyph className={className} strokeWidth={2}>
      <path d="m12 19 7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18zM2 2l7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </Glyph>
  );
}

export function CodeIcon({ className }: IconProps) {
  return (
    <Glyph className={className} strokeWidth={2}>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </Glyph>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <Glyph className={className} strokeWidth={2}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Glyph>
  );
}

export function LayoutIcon({ className }: IconProps) {
  return (
    <Glyph className={className} strokeWidth={2}>
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M3 9h18M9 21V9" />
    </Glyph>
  );
}
