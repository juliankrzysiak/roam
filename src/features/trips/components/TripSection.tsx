"use client";
import { Button } from "@/components/ui/button";
import { Trip } from "@/types";
import { convertTime, formatDateRange, formatTotalDuration } from "@/utils";
import { setCookie } from "@/utils/actions/cookies";
import Link from "next/link";
import ShareTrip from "./ShareTrip";
import TripOptions from "./TripOptions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

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

  const distance = days.reduce((acc, cur) => acc + cur.totals.distance, 0);
  const duration = convertTime({
    minutes: days.reduce((acc, cur) => acc + cur.totals.duration, 0),
  });

  return (
    <article className="relative flex flex-col items-center gap-5 rounded-lg bg-slate-100 px-4 pb-3 pt-6 text-center shadow-md">
      {sharing.isSharing && (
        <span className="absolute left-2 top-2 text-sm text-slate-600">
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
      <div>
        <h3 className="text-2xl font-semibold">{name}</h3>
        <p>{formattedRange}</p>
      </div>
      <div className=" flex w-full max-w-sm flex-col items-center gap-3">
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
      <Collapsible className="flex w-full flex-col items-center">
        <CollapsibleTrigger className="w-full">
          <span className="flex w-full items-center justify-center gap-1 text-slate-600">
            Totals <ChevronsUpDown size={16} />
          </span>
          <CollapsibleContent>
            <div className="flex flex-col gap-1 text-sm">
              <span>{days.length} days</span>
              <span>{distance} miles</span>
              <span>{formatTotalDuration(duration)}</span>
            </div>
          </CollapsibleContent>
        </CollapsibleTrigger>
      </Collapsible>
    </article>
  );
}
