import Map from "@/features/map/components";
import Planner from "@/features/planner/components";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { PlaceT, TripInfo } from "@/types";

type Params = {
  params: { trip: number; day: number };
};

export default async function MapPage({ params }: Params) {
  const { day } = params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: places, error } = await supabase.rpc("get_places", { day });
  const { data: startTime } = await supabase
    .from("days")
    .select("start_time")
    .limit(1)
    .single();
  const tripInformation = await getTripInfo(places);
  const placesWithTripInfo = places.map(function combineInfo(
    place: PlaceT,
    i: number,
  ) {
    const tripInfo = tripInformation[i];
    return {
      ...place,
      tripInfo,
    };
  });
  if (error) throw new Error(`Supabase error: ${error.message}`);

  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} params={params} />
      <Planner places={placesWithTripInfo} start={startTime?.start_time} />
    </main>
  );

  async function getTripInfo(places: PlaceT[]) {
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

    const legs = tripInformation.routes.at(0).legs.map((leg) => {
      const distance = Math.round(leg.distance * meterToMileFactor);
      const duration = Math.round(leg.duration * secondToMinuteFactor);
      return { distance, duration };
    }) as TripInfo[];
    return legs;
  }
}
