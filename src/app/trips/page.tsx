import NewTripForm from "@/features/trips/components/NewTripForm";
import TripSection from "@/features/trips/components/TripSection";
import { Trip, TripData } from "@/types";
import { calcDateRange, formatTripData } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { isPast } from "date-fns";

export default async function Trips() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No authorization.");

  const { data: trips, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, totalDuration:total_duration, totalDistance:total_distance, orderPlaces:order_places), currentDate:current_date, isSharing: is_sharing, sharingId:sharing_id, timezone",
    )
    .order("date", { referencedTable: "days" })
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);

  const initialObject: {
    upcomingTrips: Trip[];
    pastTrips: Trip[];
  } = { upcomingTrips: [], pastTrips: [] };

  const { upcomingTrips, pastTrips } = trips.reduce((acc, current) => {
    const trip = formatTripData(current);
    if (isPast(trip.dateRange.to)) acc.pastTrips.push(trip);
    else acc.upcomingTrips.push(trip);
    return acc;
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
