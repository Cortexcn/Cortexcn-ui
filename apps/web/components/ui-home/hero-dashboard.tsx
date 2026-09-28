import { StatCardArea } from "@/blocks/stat-card-area-01/files/components/stat-card-area";
import { StatCardLine } from "@/blocks/stat-card-line-01/files/components/stat-card-line";
import { cn } from "@/lib/utils";

import { AppWindow, RegistryTag } from "./app-window";
import { HeroRevenue } from "./hero-revenue";

const NAV_ITEMS = ["Overview", "Revenue", "Customers", "Reports", "Settings"];
const RANGES = ["7D", "30D", "90D"];

/**
 * A sample dashboard assembled from real registry items: two stat card blocks
 * and a number ticker, each tagged with its install name. It is wider than
 * the art panel on purpose and bleeds off its right edge.
 */
export function HeroDashboard({ className }: { className?: string }) {
  return (
    <AppWindow
      className={cn("w-[640px] md:w-[880px]", className)}
      title="Overview"
    >
      <div className="flex">
        <div className="hidden w-44 shrink-0 flex-col gap-0.5 border-border border-r p-3 md:flex">
          <span className="mb-3 flex items-center gap-2 px-2 font-medium text-sm">
            <span
              aria-hidden="true"
              className="size-4 rounded-[5px] bg-foreground"
            />
            Acme
          </span>
          {NAV_ITEMS.map((item, index) => (
            <span
              className={cn(
                "rounded-md px-2 py-1.5 text-muted-foreground text-sm",
                index === 0 && "bg-muted font-medium text-foreground",
              )}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
          <div className="flex items-end justify-between gap-4">
            <div className="relative flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">
                Revenue this month
              </span>
              <HeroRevenue value={48_210} />
              <RegistryTag
                className="absolute top-0 left-full ml-3"
                name="number-ticker"
              />
            </div>
            <div className="flex rounded-lg border border-border p-0.5 text-xs">
              {RANGES.map((range, index) => (
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-muted-foreground",
                    index === 1 && "bg-muted font-medium text-foreground",
                  )}
                  key={range}
                >
                  {range}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <StatCardArea />
              <RegistryTag
                className="absolute -top-2 right-3"
                name="stat-card-area-01"
              />
            </div>
            <div className="relative">
              <StatCardLine />
              <RegistryTag
                className="absolute -top-2 right-3"
                name="stat-card-line-01"
              />
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
