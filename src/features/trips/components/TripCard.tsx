"use client";

import { Button } from "@/components/ui/button";
import { Trip } from "@/types";
import { formatDateRange } from "@/utils";
import { setCookie } from "@/utils/actions/cookies";
import Link from "next/link";
import TripOptions from "./TripOptions";

// TODO: Add back options to the cards
export default function TripCard({
  tripId,
  name,
  dateRange,
  currentDate,
  days,
  sharing,
}: Trip) {
  const formattedRange = formatDateRange(dateRange);
  const datesWithPlaces = days.flatMap((day) =>
    day.orderPlaces.length ? day.date : [],
  );

  async function handleClick() {
    setCookie("tripId", tripId);
  }

  return (
    <article className="relative flex flex-col items-center justify-between gap-1 rounded-lg bg-slate-100 px-4 py-6 text-center">
      {sharing.isSharing && (
        <span className="absolute left-2 top-2 text-sm text-slate-500">
          shared
        </span>
      )}
      <TripOptions
        tripId={tripId}
        name={name}
        dateRange={dateRange}
        currentDate={currentDate}
        datesWithPlaces={datesWithPlaces}
      />
      <h3 className="text-2xl font-semibold">{name}</h3>
      <p>{formattedRange}</p>
      <div className="mt-6 flex w-full max-w-sm flex-col items-center gap-3">
        <Button variant="default" className="w-full" asChild>
          <Link href={`/planner/${tripId}`} onClick={handleClick}>
            Start planning
          </Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`trips/${tripId}`}>See details</Link>
        </Button>
      </div>
    </article>
  );
}
