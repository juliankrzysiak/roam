import Map from "@/features/map/components";
import Planner from "@/features/planner/components";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { PlaceT, Trip } from "@/types";

type Params = {
  params: { trip: number; day: number };
};

export default async function MapPage({ params }: Params) {
  const { trip, day } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // TODO: Combine these into one query
  const { data: places, error } = await supabase.rpc("get_places", { day });
  const { data: orderDays } = await supabase
    .from("trips")
    .select("order_days")
    .eq("id", trip)
    .limit(1)
    .single();
  const { data: startTime } = await supabase
    .from("days")
    .select("start_time")
    .limit(1)
    .single();
  const trips = await getTrips(places);
  const placesWithTripInfo = combineTripInfo(places, trips);
  if (error) throw new Error(`Supabase error: ${error.message}`);

  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} params={params} />
      <Planner
        places={placesWithTripInfo}
        orderDays={orderDays?.order_days}
        start={startTime?.start_time}
        params={params}
      />
    </main>
  );
}

function combineTripInfo(places: PlaceT[], trips: Trip[]) {
  return places.map((place, i) => {
    const tripInfo = trips[i];
    return { ...place, tripInfo };
  });
}

async function getTrips(places: PlaceT[]): Promise<Trip[]> {
  const coordinates = places
    .map((place) => `${place.lng},${place.lat}`)
    .join(";");

  const profile = "mapbox/driving";
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
  );
  const tripInformation = await res.json();

  const meterToMileFactor = 1 / (1000 * 1.609);
  const secondToMinuteFactor = 1 / 60;

  const trips = tripInformation.routes.at(0).legs.map((leg: Trip) => {
    const distance = Math.round(leg.distance * meterToMileFactor);
    const duration = Math.round(leg.duration * secondToMinuteFactor);
    return { distance, duration };
  });

  return trips;
}
