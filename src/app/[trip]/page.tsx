import TogglePlannerButton from "@/components/general/TogglePlannerButton";
import PDFButton from "@/features/pdf/components/PDFButton";
import Map from "@/features/map/components/Map";
import MapControls from "@/features/map/components/MapControls";
import MapSearch from "@/features/map/components/MapSearch";
import Planner from "@/features/planner/components/Planner";
import { Day, Place, PlaceNoSchedule, Travel } from "@/types";
import { Database } from "@/types/supabase";
import { calcDateRange, convertKmToMi, convertSecToMi } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { addMinutes, parse } from "date-fns";

type Props = {
  params: { trip: string };
};

export default async function MapPage({ params }: Props) {
  const { trip: tripId } = params;
  const supabase = createClient();

  const day = await getDay(supabase, tripId);
  const dateRange = await getDateRange(supabase, tripId);
  const tripName = await getTripName(supabase, tripId);

  const totalDuration = day.places.reduce(
    (total, current) =>
      total + (current.travel?.duration || 0) + current.placeDuration,
    0,
  );

  // const endTime = add(parse(dayInfo.startTime, "HH:mm:ss", new Date()), {
  //   minutes: totalDuration,
  // });

  // const trips = await getTrips(orderedPlaces);
  // const places = combineTripInfo(orderedPlaces, trips);

  return (
    // <DayProvider dayInfo={dayInfo}>
    <main className="relative h-40 flex-grow sm:flex">
      <Planner
        day={day}
        tripId={tripId}
        tripName={tripName}
        dateRange={dateRange}
        totalDuration={totalDuration}
      />
      <Map day={day}>
        <MapSearch />
        <MapControls tripId={tripId} day={day} dateRange={dateRange} />
        <PDFButton />
      </Map>
      <TogglePlannerButton />
    </main>
    // </DayProvider>
  );
}

async function getTripName(supabase: SupabaseClient<Database>, tripId: string) {
  const { data, error } = await supabase
    .from("trips")
    .select("name")
    .eq("id", tripId)
    .limit(1)
    .single();
  if (error) throw new Error(`${error.message}`);
  return data.name;
}

async function getDateRange(
  supabase: SupabaseClient<Database>,
  tripId: string,
) {
  const { data, error } = await supabase
    .from("days")
    .select("date")
    .eq("trip_id", tripId);
  if (error) throw new Error(`${error.message}`);
  const dateRange = calcDateRange(data);
  return dateRange;
}

async function getDay(
  supabase: SupabaseClient<Database>,
  tripId: string,
): Promise<Day> {
  const { data: dateData, error: dateError } = await supabase
    .from("trips")
    .select("current_date")
    .eq("id", tripId)
    .limit(1)
    .single();
  if (dateError) throw new Error(`Supbase error: ${dateError.message}`);

  const { data: dayData, error: dayError } = await supabase
    .from("days")
    .select("id, date, startTime:start_time, orderPlaces:order_places")
    .match({ trip_id: tripId, date: dateData.current_date })
    .limit(1)
    .single();
  if (dayError) throw new Error(`Supbase error: ${dayError.message}`);

  const { data: placesData, error } = await supabase
    .from("places")
    .select(
      "id, name, lat, lng, placeDuration:place_duration, tripDuration:trip_duration, placeId:place_id",
    )
    .eq("day_id", dayData.id);
  if (error) throw new Error(`Supabase error: ${error.message}`);

  // TODO: Replace this with rpc
  const sortedPlaces = dayData.orderPlaces.map((id) => {
    const place = placesData.find((place) => place.id === id);
    const { lat, lng, ...placeProps } = place;
    return { ...placeProps, position: { lat, lng } };
  });

  const travelInfo = await getTravelInfo(sortedPlaces);
  const travelPlaces = await mapTravelInfo(sortedPlaces, travelInfo?.trips);

  const startTime = parse(dayData.startTime, "HH:mm:ss", new Date());
  const scheduledPlaces = mapSchedule(travelPlaces, startTime);

  const day = {
    ...dayData,
    date: parse(dayData.date, "yyyy-MM-dd", new Date()),
    travel: travelInfo?.travel,
  };

  return {
    ...day,
    places: scheduledPlaces,
  };
}

function mapSchedule(places: PlaceNoSchedule[], startTime: Date): Place[] {
  let arrival = startTime;
  let departure;

  const calculatedPlaces = places.map((place) => {
    const { placeDuration } = place;
    departure = addMinutes(arrival, placeDuration);
    const schedule = { arrival, departure };
    const updatedPlace = { ...place, schedule };
    arrival = addMinutes(departure, place.travel?.duration || 0);
    return updatedPlace;
  });

  return calculatedPlaces;
}

async function mapTravelInfo(
  places: PlaceNoSchedule[],
  trips: Travel[] | undefined,
): Promise<PlaceNoSchedule[]> {
  if (!trips) return places;
  else
    return places.map((place, i) => {
      const travel = trips[i];
      return { ...place, travel };
    });
}

async function getTravelInfo(
  places: PlaceNoSchedule[],
): Promise<{ trips: Travel[]; travel: Travel } | undefined> {
  if (places.length < 2) return;
  const coordinates = places
    .map((place) => `${place.position.lng},${place.position.lat}`)
    .join(";");

  const profile = "mapbox/driving";
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
  );
  const tripInformation = await res.json();
  const travel = {
    distance: convertKmToMi(tripInformation.routes[0].distance),
    duration: convertSecToMi(tripInformation.routes[0].duration),
  };

  const trips = tripInformation.routes[0].legs.map(
    (leg: { distance: number; duration: number }) => {
      const distance = convertKmToMi(leg.distance);
      const duration = convertSecToMi(leg.duration);
      return { distance, duration };
    },
  );

  return {
    trips,
    travel,
  };
}
