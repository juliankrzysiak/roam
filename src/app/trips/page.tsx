import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewTripForm from "@/features/trips/components/NewTripForm";
import PlannerLink from "@/features/trips/components/PlannerLink";
import ShareTrip from "@/features/trips/components/ShareTrip";
import TripOptions from "@/features/trips/components/TripOptions";
import { Trip as TripType } from "@/types";
import { convertTime, formatDateRange, formatTripData } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { isPast } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

export default async function TripsPage() {
  return (
    <main className="flex flex-col items-center gap-8 p-6">
      <NewTripForm />
      <Tabs
        defaultValue="upcoming"
        className="flex w-full flex-col items-center"
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <Suspense
          fallback={
            <span className="flex gap-2">
              <LoaderCircle className="animate-spin" />
              Loading trips...
            </span>
          }
        >
          <TripContent />
        </Suspense>
      </Tabs>
    </main>
  );
}

async function TripContent() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No authorization.");
  const userId = user.id;
  const { data, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, totalDuration:total_duration, totalDistance:total_distance, orderPlaces:order_places), currentDate:current_date, isSharing: is_sharing, sharingId:sharing_id, timezone",
    )
    .eq("user_id", userId)
    .order("date", { referencedTable: "days" });
  if (error) throw new Error(error.message);

  const trips = data.map((trip) => formatTripData(trip));

  const initialObject: {
    upcomingTrips: TripType[];
    pastTrips: TripType[];
  } = { upcomingTrips: [], pastTrips: [] };

  const { upcomingTrips, pastTrips } = trips.reduce((total, trip) => {
    if (isPast(trip.dateRange.to)) total.pastTrips.unshift(trip);
    else total.upcomingTrips.unshift(trip);
    return total;
  }, initialObject);

  return (
    <section className="w-full  p-6">
      <TabsContent value="upcoming">
        <Trips trips={upcomingTrips} />
      </TabsContent>
      <TabsContent value="past">
        <Trips trips={pastTrips} />
      </TabsContent>
    </section>
  );
}

type TripsProps = {
  trips: TripType[];
};

function Trips({ trips }: TripsProps) {
  return (
    <div className="grid w-full grid-cols-magic gap-6">
      {trips.length ? (
        trips.map((trip) => {
          return <Trip key={trip.tripId} {...trip} />;
        })
      ) : (
        <p className="text-slate-600">A bit empty here...</p>
      )}
    </div>
  );
}

function Trip({
  tripId,
  name,
  dateRange,
  sharing,
  currentDate,
  days,
}: TripType) {
  const formattedRange = formatDateRange(dateRange);
  const datesWithPlaces = days.flatMap((day) =>
    day.orderPlaces.length ? day.date : [],
  );

  const distance = days.reduce((acc, cur) => acc + cur.totals.distance, 0);
  const duration = convertTime({
    minutes: days.reduce((acc, cur) => acc + cur.totals.duration, 0),
  });
  const formattedDuration = `${duration.hours.toString()}:${duration.minutes
    .toString()
    .padStart(2, "0")}`;

  return (
    <article className="relative flex flex-col items-center rounded-md border border-emerald-950/25 bg-slate-50 text-center shadow-md">
      {sharing.isSharing && (
        <span className="absolute -top-4 left-2 -z-10 rounded-t-md border border-emerald-950/25 bg-slate-50 px-2 text-xs">
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
      <div className="flex-1 p-2">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <p className="text-lg">{formattedRange}</p>
      </div>
      <div className="flex w-full items-center justify-center gap-3 pb-2">
        <div className="flex flex-col items-center">
          <span>{days.length}</span>
          <span className="text-sm text-slate-600">days</span>
        </div>
        <div className="h-1/2 w-[1px] bg-slate-300" />
        <div className="flex flex-col items-center">
          <span>{distance}</span>
          <span className="text-sm text-slate-600">miles</span>
        </div>
        <div className="h-1/2 w-[1px] bg-slate-300" />
        <div className="flex flex-col items-center">
          <span>{formattedDuration}</span>
          <span className="text-sm text-slate-600">travel</span>
        </div>
      </div>
      <div className="flex h-fit w-full flex-col items-center">
        <PlannerLink tripId={tripId} />
        <div className="flex w-full">
          <ShareTrip tripId={tripId} sharing={sharing}>
            <Button variant="outline" className="h-fit w-full border-none">
              Share
            </Button>
          </ShareTrip>
          <div className="h-full w-[1px] bg-emerald-950/25"></div>
          <Button variant="outline" className="h-fit w-full border-none">
            Print
          </Button>
        </div>
      </div>
    </article>
  );
}
