"use client";

import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type Props = {
  user: User | null;
  tripId?: string;
};

export default function Nav({ user, tripId }: Props) {
  const pathName = usePathname();
  const { trip } = useParams<{ trip: string }>();

  return (
    <nav className="flex items-baseline gap-6">
      <Link href="/" className="font-display text-3xl text-slate-100">
        roam
      </Link>
      {user && (
        <div className="flex gap-4 text-xl font-light text-slate-100">
          <Link
            href="/trips"
            className={clsx(pathName.includes("trips") && "font-semibold")}
          >
            Trips
          </Link>
          {tripId && (
            <Link
              href={`/${tripId}`}
              className={clsx(
                trip && !pathName.includes("pdf") && "font-semibold",
              )}
            >
              Planner
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
