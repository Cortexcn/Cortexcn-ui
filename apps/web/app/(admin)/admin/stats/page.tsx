import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UsageStats } from "@/components/admin/usage-stats";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { authServer } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

// Reads the session cookie, so it renders on every request.
export const dynamic = "force-dynamic";

function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
      <p className="max-w-md text-muted-foreground">{body}</p>
      {action ? (
        <Link
          className={buttonVariants({ className: "mt-2" })}
          href={action.href}
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export default async function AdminStatsPage() {
  if (!authServer) {
    return (
      <Notice
        body="This copy of the site has no Convex deployment, so there is no usage log to show."
        title="Sign-in is off"
      />
    );
  }

  if (!(await authServer.isAuthenticated())) {
    redirect("/sign-in?next=/admin/stats");
  }

  const stats = await authServer.fetchAuthQuery(api.usage.stats);
  if (!stats) {
    return (
      <Notice
        action={{ label: "Back to Cortexcn", href: "/" }}
        body="This dashboard is only for Cortexcn admins. Ask the owner to add your email to ADMIN_EMAILS."
        title="You do not have access"
      />
    );
  }

  return <UsageStats data={stats} />;
}
