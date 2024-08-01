"use client";

import { User } from "@supabase/supabase-js";
import clsx from "clsx";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  user?: User;
};

export default function Nav({ user }: Props) {
  const [tripId, setTripId] = useState<string | null>(null);
  const pathName = usePathname();
  const { trip } = useParams<{ trip: string }>();

  // todo: wipe away localStorage when logging out, affects new account
  useEffect(() => {
    const tripId = localStorage.getItem("tripId");
    if (tripId) setTripId(tripId);
  }, []);

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
