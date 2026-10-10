import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

// Keeps the usage log bounded: raw events for 30 days, daily counts for 90.
crons.daily(
  "prune usage log",
  { hourUTC: 3, minuteUTC: 15 },
  internal.usage.prune,
  {},
);

export default crons;
