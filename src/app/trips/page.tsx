import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewTripForm from "@/features/trips/components/NewTripForm";
import PlannerLink from "@/features/trips/components/PlannerLink";
import ShareTrip from "@/features/trips/components/ShareTrip";
import TripOptions from "@/features/trips/components/TripOptions";
import { Trip as TripType } from "@/types";
import {
  convertTime,
  formatDateRange,
  formatTotalDuration,
  formatTripData,
} from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { isPast } from "date-fns";
import { ChevronsUpDown, LoaderCircle } from "lucide-react";
import { Suspense } from "react";

export default async function TripsPage() {
  return (
    <main className="flex flex-col items-center gap-8 p-6">
      <NewTripForm />

      <div className="flex h-screen w-full flex-col items-center gap-16">
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
      </div>
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
    if (isPast(trip.dateRange.to)) total.pastTrips.push(trip);
    else total.upcomingTrips.push(trip);
    return total;
  }, initialObject);

  return (
    <section className="grid w-full grid-cols-magic gap-4 rounded-md bg-slate-300 p-4 text-center">
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
    <div>
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
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <PlannerLink tripId={tripId} />
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
