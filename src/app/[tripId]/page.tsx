import TogglePlannerButton from "@/components/general/TogglePlannerButton";
import Map from "@/features/map/components/Map";
import MapDatePicker from "@/features/map/components/MapDatePicker";
import MapSearch from "@/features/map/components/MapSearch";
import Planner from "@/features/planner/components/Planner";
import { Day, Place, PlaceNoSchedule, Travel } from "@/types";
import { calcDateRange, convertKmToMi, convertSecToMi } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

type Props = {
  params: { tripId: string };
  searchParams: { sharing?: boolean };
};

export default async function MapPage({ params, searchParams }: Props) {
  const { tripId } = params;
  const { sharing } = searchParams;
  const tripInfo = await getTripInfo(tripId);
  if (!tripInfo) throw new Error("Couldn't connect to server.");
  const { tripName, timezone, dateRange, isTripShared } = tripInfo;
  const isShared = isTripShared && Boolean(sharing);

  const day = await getDay(tripId, timezone);
  const totalDuration = day.places.reduce(
    (total, current) =>
      total + (current.travel?.duration || 0) + current.placeDuration,
    0,
  );

  return (
    <main className="relative h-40 flex-grow sm:flex">
      <Planner
        day={day}
        tripId={tripId}
        tripName={tripName}
        totalDuration={totalDuration}
        dateRange={dateRange}
        isShared={isShared}
      />
      <Map day={day} isShared={isShared}>
        <MapSearch />
        <MapDatePicker tripId={tripId} day={day} dateRange={dateRange} />
      </Map>
      <TogglePlannerButton />
    </main>
  );
}

export async function getDay(
  tripId: string,
  timezone: string,
  currentDate?: string,
): Promise<Day> {
  const supabase = createClient();
  let tripDate;

  if (!currentDate) {
    const { data: dateData, error: dateError } = await supabase
      .from("trips")
      .select("current_date")
      .eq("id", tripId)
      .limit(1)
      .single();
    if (dateError) throw new Error(`Supbase error: ${dateError.message}`);
    tripDate = dateData.current_date;
  }

  const { data: dayData, error: dayError } = await supabase
    .from("days")
    .select(
      "id, date, startTime:start_time, timezone, orderPlaces:order_places",
    )
    .match({ trip_id: tripId, date: currentDate || tripDate })
    .limit(1)
    .single();
  if (dayError) throw new Error(`Supbase error: ${dayError.message}`);

  const { data: placesData, error } = await supabase
    .from("places")
    .select(
      "id, name, lat, lng, placeDuration:place_duration, placeId:place_id, address, notes",
    )
    .eq("day_id", dayData.id);
  if (error) throw new Error(`Supabase error: ${error.message}`);

  // TODO: Replace this with rpc
  const sortedPlaces = dayData.orderPlaces.map((id) => {
    const place = placesData.find((place) => place.id === id);
    if (!place) throw new Error("Couldn't find place.");
    const { lat, lng, ...placeProps } = place;
    return { ...placeProps, position: { lat, lng } };
  });

  const travelInfo = await getTravelInfo(sortedPlaces);
  const travelPlaces = await mapTravelInfo(sortedPlaces, travelInfo?.trips);

  const date = fromZonedTime(
    parseISO(dayData.date + "T" + dayData.startTime),
    timezone,
  );
  const scheduledPlaces = mapSchedule(travelPlaces, date);

  const day = {
    ...dayData,
    date,
    travel: travelInfo.travel,
    path: travelInfo?.path,
  };

  return {
    ...day,
    places: scheduledPlaces,
  };
}

async function getTravelInfo(
  places: PlaceNoSchedule[],
): Promise<{ trips?: Travel[]; travel: Travel; path?: string }> {
  if (places.length < 2)
    return {
      travel: {
        distance: 0,
        duration: 0,
      },
    };
  const coordinates = places
    .map((place) => `${place.position.lng},${place.position.lat}`)
    .join(";");

  const profile = "mapbox/driving";
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?overview=full&geometries=polyline&access_token=${process.env.MAPBOX_API_KEY}`,
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
  const path = tripInformation.routes[0].geometry as string;

  return {
    trips,
    travel,
    path,
  };
}

export async function getTripInfo(tripId: string) {
  const supabase = createClient();

  try {
    const { data: tripNameData, error: tripNameError } = await supabase
      .from("trips")
      .select("name, timezone, sharing")
      .eq("id", tripId)
      .limit(1)
      .single();
    if (tripNameError) throw new Error(`${tripNameError.message}`);
    const { name: tripName, timezone, sharing: isTripShared } = tripNameData;

    const { data: daysData, error: daysError } = await supabase
      .from("days")
      .select("date, orderPlaces:order_places")
      .eq("trip_id", tripId)
      .order("date");
    if (daysError) throw new Error(`${daysError.message}`);
    const dateRange = calcDateRange(daysData, timezone);

    return {
      tripName,
      timezone,
      dateRange,
      isTripShared,
    };
  } catch (error) {
    console.log(error);
  }
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
