"use client";
import { Button } from "@/components/ui/button";
import { Trip } from "@/types";
import { formatDateRange } from "@/utils";
import { setCookie } from "@/utils/actions/cookies";
import Link from "next/link";
import TripOptions from "./TripOptions";
import ShareTrip from "./ShareTrip";

type Props = {
  trips: Trip[];
  title: string;
  defaultMessage?: string;
  children?: React.ReactNode;
};

export default function TripSection({
  trips,
  title,
  defaultMessage = "It's a bit empty here...",
  children,
}: Props) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-2 ">
      {children}
      <h2 className="text-2xl font-light">{title}</h2>
      <section className="grid w-full grid-cols-magic gap-4 rounded-md bg-slate-300 p-4 text-center">
        {trips.length < 1 && <p className="text-slate-600">{defaultMessage}</p>}
        {trips.map((trip) => {
          return <TripCard key={trip.tripId} {...trip} />;
        })}
      </section>
    </div>
  );
}

function TripCard({
  tripId,
  name,
  dateRange,
  sharing,
  currentDate,
  days,
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
        sharing={sharing}
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
        <ShareTrip tripId={tripId} sharing={sharing}>
          <Button variant="outline" className="w-full">
            Share trip
          </Button>
        </ShareTrip>
      </div>
    </article>
  );
}
