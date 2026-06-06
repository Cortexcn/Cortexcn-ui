"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeftIcon } from "lucide-react";

import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from "@/components/ui/morphing-popover";

export default function MorphingPopoverDemo() {
  const uniqueId = useId();
  const [note, setNote] = useState("");

  return (
    <MorphingPopover
      transition={{ type: "spring", bounce: 0.05, duration: 0.3 }}
    >
      <MorphingPopoverTrigger className="flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium">
        <motion.span layoutId={`popover-label-${uniqueId}`}>
          Add Note
        </motion.span>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent className="rounded-xl border border-border bg-popover p-0 shadow-md">
        <div className="h-[180px] w-[280px]">
          <form
            className="flex h-full flex-col"
            onSubmit={(e) => e.preventDefault()}
          >
            <textarea
              className="h-full w-full resize-none rounded-md bg-transparent px-3 py-2 text-sm outline-none"
              autoFocus
              placeholder="Write a note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-between border-t border-border px-3 py-2">
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeftIcon className="size-4" />
                Back
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-2.5 py-1 text-sm font-medium text-primary-foreground"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}
