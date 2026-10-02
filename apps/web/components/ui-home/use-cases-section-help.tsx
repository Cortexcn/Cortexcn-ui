import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@cortexcn/ui/components/card";
import { FAQTabsCard } from "@cortexcn/ui/components/faq-tabs-card";

import { AppWindow, RegistryTag } from "./app-window";
import { DocumentIcon } from "./use-cases-section-icons";

const GUIDES = [
  "Import your first data source",
  "Invite your team",
  "Share a dashboard link",
];

/**
 * A help center page: an intro, popular guides, and a status card on the
 * left, and the live FAQ tabs card, with its sample questions, on the right.
 */
export function UseCasesHelpWindow() {
  return (
    <AppWindow className="flex h-full flex-col" title="Help center">
      <div className="@container scrollbar-thin min-h-0 flex-1 overflow-y-auto bg-(--surface) [scrollbar-color:var(--border)_transparent]">
        <div className="grid min-h-full @xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] gap-5 p-3 sm:p-4">
          <div className="@xl:flex hidden min-w-0 flex-col">
            <p className="text-muted-foreground text-xs">Support</p>
            <p className="mt-1.5 text-balance font-medium text-[22px] leading-[1.15] tracking-[-0.035em]">
              How can we help?
            </p>
            <p className="mt-2 text-pretty text-[13px] text-body leading-relaxed">
              Answers to the questions people ask most.
            </p>

            <p className="mt-5 font-medium text-muted-foreground text-xs">
              Popular guides
            </p>
            <ul className="mt-2 flex flex-col border-border border-t">
              {GUIDES.map((guide) => (
                <li
                  className="flex items-center gap-2.5 border-border border-b py-2.5 text-[13px]"
                  key={guide}
                >
                  <DocumentIcon className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{guide}</span>
                </li>
              ))}
            </ul>

            <div className="relative mt-auto pt-5">
              <Card size="sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full bg-emerald-500"
                    />
                    All systems normal
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Checked 2 minutes ago
                  </CardDescription>
                </CardHeader>
              </Card>
              <RegistryTag className="absolute top-3 right-3" name="card" />
            </div>
          </div>

          <div className="relative min-w-0">
            <FAQTabsCard
              className="rounded-[20px] p-4"
              footerLabel="Contact support"
            />
            <RegistryTag
              className="absolute -top-2 right-5"
              name="faq-tabs-card"
            />
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
