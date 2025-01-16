"use client";

import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  user: User | null;
  cookieTripId?: string;
};

export default function Nav({ user, cookieTripId }: Props) {
  const pathName = usePathname();

  return (
    <nav className="flex items-baseline gap-6">
      <h1>
        <Link href="/" className="font-display text-3xl text-slate-100">
          roam
        </Link>
      </h1>
      {user && (
        <div className="flex gap-4 text-xl font-light text-slate-100">
          <Link
            href="/trips"
            className={clsx(pathName.includes("trips") && "font-semibold")}
          >
            Trips
          </Link>
          {cookieTripId && (
            <Link
              href={`/planner/${cookieTripId}`}
              className={clsx(pathName.includes("planner") && "font-semibold")}
            >
              Planner
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
