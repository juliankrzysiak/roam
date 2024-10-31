import { Button } from "@/components/ui/button";
import ShareTrip from "@/features/trips/components/ShareTrip";
import TripOptions from "@/features/trips/components/TripOptions";
import { Trip } from "@/types";
import {
  convertTime,
  formatDateRange,
  formatTotalDuration,
  formatTripData,
} from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import GoToDateButton from "../../../features/trips/components/GoTodDateButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  params: { tripId: string };
};

export default async function TripPage({ params }: Props) {
  const { tripId } = params;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, totalDuration:total_duration, totalDistance:total_distance, orderPlaces:order_places), currentDate:current_date, isSharing: is_sharing, sharingId:sharing_id, timezone",
    )
    .eq("id", tripId)
    .order("date", { referencedTable: "days" })
    .limit(1)
    .single();
  if (error) throw new Error("Couldn't get trip information.");
  const trip = formatTripData(data);
  const { name, dateRange, currentDate, sharing, days } = trip;
  const formattedRange = formatDateRange(dateRange, "EEE, MMM dd");
  const totals = {
    distance: days.reduce((acc, curr) => acc + curr.totals.distance, 0),
    duration: convertTime({
      minutes: days.reduce((acc, curr) => acc + curr.totals.duration, 0),
    }),
    days: days.length,
  };
  const datesWithPlaces = days.flatMap((day) =>
    day.orderPlaces.length ? day.date : [],
  );

  return (
    <main className="grid place-items-center px-6 py-4">
      <div className="relative flex w-full max-w-3xl flex-col items-center rounded-md border-2 border-slate-300 bg-slate-100 px-6 py-4">
        <Link
          href="/trips"
          className="absolute left-2 top-2 text-sm text-slate-500"
        >
          <span className="flex items-center">
            <ChevronLeft size={16} /> back
          </span>
        </Link>
        <TripOptions
          tripId={tripId}
          name={name}
          dateRange={dateRange}
          currentDate={currentDate}
          datesWithPlaces={datesWithPlaces}
        />
        <h2 className="mb-2 text-3xl">{name}</h2>
        <div className="mb-4 flex flex-col gap-4">
          <span className="text-lg">{formattedRange}</span>
          <div className="flex gap-2 ">
            <ShareTrip
              tripId={tripId}
              sharing={sharing.isSharing}
              sharingId={sharing.sharingId}
            >
              <Button variant="outline" className="flex-1">
                Share
              </Button>
            </ShareTrip>
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/pdf/${tripId}`}>Print</Link>
            </Button>
          </div>
        </div>
        <div className="mb-4 flex w-full flex-col items-center gap-2">
          <h3 className="text-2xl">Totals</h3>
          <div className="flex w-full flex-col items-center gap-1">
            <span> {totals.distance} miles</span>
            <span> {formatTotalDuration(totals.duration)} </span>
            <span> {totals.days} days</span>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <h3 className="text-2xl">Breakdown</h3>
          <Days tripId={tripId} days={trip.days} />
        </div>
      </div>
    </main>
  );
}

async function Days({ tripId, days }: Pick<Trip, "tripId" | "days">) {
  return (
    <Accordion type="single" collapsible>
      <ul className="flex w-full flex-col items-center gap-4">
        {days.map((day, i) => {
          const index = i + 1;
          const date = format(day.date, "EEE, MMM dd");
          const numberOfStops = day.orderPlaces.length + " places";
          const distance = day.totals.distance + " miles";
          const duration = formatTotalDuration(
            convertTime({ minutes: day.totals.duration }),
          );

          return (
            <AccordionItem value={day.date.toISOString()}>
              <li
                key={day.date.toString()}
                className="relative flex w-full max-w-sm flex-col items-center gap-2 rounded-sm border border-slate-500 px-4 py-2 odd:bg-slate-200"
              >
                <span className="absolute left-0 top-0 rounded-br-md border-b border-r border-slate-500 px-1">
                  {index}
                </span>
                <AccordionTrigger>
                  <h4 className="text-lg font-semibold">{date}</h4>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col items-center gap-0">
                    <span>{distance}</span>
                    <span>{duration}</span>
                    <span>{numberOfStops}</span>
                  </div>
                  <GoToDateButton tripId={tripId} date={day.date} />
                </AccordionContent>
              </li>
            </AccordionItem>
          );
        })}
      </ul>
    </Accordion>
  );
}
