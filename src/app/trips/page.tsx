import NewTripForm from "@/features/trips/components/NewTripForm";
import TripCard from "@/features/trips/components/TripCard";
import TripSection from "@/features/trips/components/TripSection";
import { Trip } from "@/types";
import { mapDateRange } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { isPast } from "date-fns";
import { redirect } from "next/navigation";

export default async function Trips() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, orderPlaces:order_places), currentDate:current_date, timezone",
    )
    .order("date", { referencedTable: "days" });
  if (error) throw new Error(error.message);

  // todo: replace with rpc
  const trips = mapDateRange(data).sort((a, b) => {
    const startDateA = a.dateRange.from;
    const startDateB = b.dateRange.from;

    if (startDateA > startDateB) return 1;
    if (startDateA < startDateB) return -1;
    else return 0;
  });

  type InitialObject = { upcomingTrips: Trip[]; pastTrips: Trip[] };
  const initialObject: InitialObject = { upcomingTrips: [], pastTrips: [] };

  const { upcomingTrips, pastTrips } = trips.reduce((previous, current) => {
    if (isPast(current.dateRange.to)) previous.pastTrips.push(current);
    else previous.upcomingTrips.push(current);
    return previous;
  }, initialObject);

  return (
    <main className="flex flex-col items-center gap-8 p-6">
      <NewTripForm />
      <div className="flex w-full flex-col items-center gap-16">
        <TripSection title="Upcoming Trips" trips={upcomingTrips} />
        <TripSection
          title="Past Trips"
          trips={pastTrips}
          defaultMessage="Nothing here yet..."
        />
      </div>
    </main>
  );
}
