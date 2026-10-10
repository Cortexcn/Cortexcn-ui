"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient, isAuthEnabled } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

function Avatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <Image
        alt=""
        className={cn("shrink-0 rounded-md object-cover", className)}
        height={32}
        referrerPolicy="no-referrer"
        src={image}
        unoptimized
        width={32}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md bg-muted font-medium text-foreground text-sm",
        className,
      )}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/** Asks the server whether this user may open /admin, once per signed-in user. */
function useIsAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    fetch("/api/admin/access")
      .then((response) => response.json() as Promise<{ admin: boolean }>)
      .then((result) => {
        if (!cancelled) {
          setIsAdmin(result.admin);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  return isAdmin;
}

/**
 * The header's account control: "Sign in" for visitors, and the avatar with
 * an account menu once signed in. Renders nothing where sign-in is off.
 */
export function UserMenu() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);
  const isAdmin = useIsAdmin(session?.user.id);

  if (!isAuthEnabled) {
    return null;
  }

  if (isPending) {
    return (
      <span
        aria-hidden="true"
        className="size-8 animate-pulse rounded-md bg-muted motion-reduce:animate-none"
      />
    );
  }

  if (!session) {
    return (
      <Link
        className={buttonVariants({ variant: "ghost" })}
        href={`/sign-in?next=${encodeURIComponent(pathname)}`}
      >
        Sign in
      </Link>
    );
  }

  const { user } = session;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account menu for ${user.name}`}
        className="rounded-md outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Avatar className="size-8" image={user.image} name={user.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="size-9" image={user.image} name={user.name} />
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-medium text-sm">{user.name}</p>
            <p className="truncate text-muted-foreground text-xs">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem render={<Link href="/admin" />}>
            Admin dashboard
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem
          disabled={signingOut}
          onClick={async () => {
            setSigningOut(true);
            await authClient.signOut();
            setSigningOut(false);
          }}
        >
          {signingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
