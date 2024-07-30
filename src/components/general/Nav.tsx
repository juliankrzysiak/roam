"use client";

import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type Props = {
  user?: User;
};

export default function Nav({ user }: Props) {
  const pathName = usePathname();
  const tripId = localStorage.getItem("tripId");
  const { trip } = useParams<{ trip: string }>();

  return (
    <nav className="flex items-baseline gap-6">
      <Link href="/" className="text-2xl text-emerald-50">
        ROAM
      </Link>
      {user && (
        <div className="flex gap-4 text-xl font-light text-slate-100">
          <Link
            href="/trips"
            className={clsx(pathName.includes("trips") && "font-bold")}
          >
            Trips
          </Link>
          {tripId && (
            <Link
              href={`/${tripId}`}
              className={clsx(trip && !pathName.includes("pdf") && "font-bold")}
            >
              Planner
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
