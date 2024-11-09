import NewTripForm from "@/features/trips/components/NewTripForm";
import TripSection from "@/features/trips/components/TripSection";
import { TripLite, Trip, TripData } from "@/types";
import { calcDateRange, formatTripData } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { isPast } from "date-fns";

export default async function Trips() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No authorization.");

  const { data, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, totalDuration:total_duration, totalDistance:total_distance, orderPlaces:order_places), currentDate:current_date, isSharing: is_sharing, sharingId:sharing_id, timezone",
    )
    .eq("user_id", user.id)
    .order("date", { referencedTable: "days" });
  if (error) throw new Error(error.message);
  const trips = data.map((trip) => formatTripData(trip));

  const initialObject: {
    upcomingTrips: Trip[];
    pastTrips: Trip[];
  } = { upcomingTrips: [], pastTrips: [] };

  const { upcomingTrips, pastTrips } = trips.reduce((total, trip) => {
    if (isPast(trip.dateRange.to)) total.pastTrips.push(trip);
    else total.upcomingTrips.push(trip);
    return total;
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
