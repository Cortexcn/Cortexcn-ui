"use client";

import { NumberTicker } from "@cortexcn/ui/components/number-ticker";

/** One fixed locale, so the server and every visitor's browser print the same digits. */
const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** The dashboard's headline figure, rolled in by the Number Ticker. */
export function HeroRevenue({ value }: { value: number }) {
  return (
    <NumberTicker
      className="font-semibold text-3xl tracking-tight"
      format={(amount) => USD.format(amount)}
      value={value}
    />
  );
}
