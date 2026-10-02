"use client";

import { LanyardBadge } from "@cortexcn/ui/components/lanyard-badge";
import { CortexcnMark } from "@/components/icons/cortexcn-mark";

/** Barcode bars, as widths in a 1 to 3 pattern, for the badge's footer. */
const BARS = [
  2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2,
];

function BadgeFront() {
  return (
    <div className="flex h-full flex-col justify-between p-5 pt-9">
      <div className="flex items-center gap-2">
        <CortexcnMark className="size-5" />
        <span className="font-semibold text-sm tracking-tight">Cortexcn</span>
        <span className="ml-auto rounded-full border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
          STAFF
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="mb-3 grid size-16 place-items-center rounded-2xl bg-muted font-semibold text-xl">
          AR
        </div>
        <p className="font-semibold text-2xl leading-tight tracking-tight">
          Alex Rivera
        </p>
        <p className="text-muted-foreground text-sm">Design Engineer</p>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div aria-hidden="true" className="flex h-8 items-stretch gap-[2px]">
          {BARS.map((width, i) => (
            <span
              className="bg-foreground"
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative pattern
              key={i}
              style={{ width }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          CX-0042
        </span>
      </div>
    </div>
  );
}

function BadgeBack() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <CortexcnMark className="size-16" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-lg tracking-tight">Cortexcn</p>
        <p className="text-muted-foreground text-sm">ui.cortexcn.dev</p>
      </div>
    </div>
  );
}

export function LanyardBadgeDemo() {
  return <LanyardBadge back={<BadgeBack />} front={<BadgeFront />} />;
}

export function LanyardBadgeFrontOnlyDemo() {
  return (
    <LanyardBadge
      className="h-[480px]"
      dropIn={false}
      front={<BadgeFront />}
      strapLength={140}
      strapText="BUILD WEEK"
    />
  );
}
