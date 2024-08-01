"use client";

import { volkhorn } from "@/app/fonts";
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

  useEffect(() => {
    const tripId = localStorage.getItem("tripId");
    if (tripId) setTripId(tripId);
  }, []);

  return (
    <nav className="flex items-baseline gap-6">
      <Link
        href="/"
        className={`text-3xl text-slate-100 ${volkhorn.className}`}
      >
        roam
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
