import TogglePlannerButton from "@/components/general/TogglePlannerButton";
import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components/Planner";
import {
  Day,
  Place,
  PlaceNoSchedule,
  RawPlaceData,
  TotalTravel,
} from "@/types";
import { calcDateRange, convertKmToMi, convertSecToMi } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

type Props = {
  params: { tripId: string };
  searchParams: { sharing?: string };
};

export default async function MapPage({ params, searchParams }: Props) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { tripId } = params;
  const { sharing } = searchParams;
  const tripInfo = await getTripInfo(tripId);
  if (!tripInfo) throw new Error("Couldn't connect to server.");
  const { tripName, timezone, dateRange, isTripShared, sharingId } = tripInfo;
  const isShared = isTripShared && sharing === sharingId;
  if (!isShared && !session) throw new Error("No authorization.");

  const day = await getDay(tripId, timezone);
  const totalDuration = day.places.reduce(
    (total, current) =>
      total + (current.travel?.duration || 0) + current.schedule.duration,
    0,
  );

  return (
    <>
      <main className="relative h-40 flex-grow sm:flex">
        <Planner
          day={day}
          tripId={tripId}
          tripName={tripName}
          totalDuration={totalDuration}
          dateRange={dateRange}
          isShared={isShared}
        />
        <Map
          tripId={tripId}
          day={day}
          isShared={isShared}
          dateRange={dateRange}
        />
      </main>
      <TogglePlannerButton />
    </>
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
      "id, name, lat, lng, placeDuration:place_duration, placeId:place_id, address, notes, routingProfile:routing_profile",
    )
    .eq("day_id", dayData.id);
  if (error) throw new Error(`Supabase error: ${error.message}`);

  // TODO: Replace this with rpc
  const sortedPlaces: RawPlaceData[] = dayData.orderPlaces.map((id) => {
    const place = placesData.find((place) => place.id === id);
    if (!place) throw new Error("Couldn't find place.");
    const { lat, lng, ...placeProps } = place;
    const position = { lat, lng };

    return { ...placeProps, position };
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
    travel: travelInfo.totalTravel,
    path: travelInfo?.path,
  };

  return {
    ...day,
    places: scheduledPlaces,
  };
}

async function getTravelInfo(places: RawPlaceData[]): Promise<{
  totalTravel: TotalTravel;
  trips?: TotalTravel[];
  path?: string;
}> {
  if (places.length < 2)
    return {
      totalTravel: {
        distance: 0,
        duration: 0,
      },
    };
  const coordinates = places
    .map((place) => `${place.position.lng},${place.position.lat}`)
    .join(";");

  const drivingRes = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?overview=full&geometries=polyline&access_token=${process.env.MAPBOX_API_KEY}`,
  );
  const drivingTravelInfo = await drivingRes.json();

  type TravelResponse = {
    routes: {
      legs: {
        distance: number;
        duration: number;
      }[];
      distance: number;
      duration: number;
      geometry: string;
    }[];
  };
  let walkingTravelInfo = {} as TravelResponse;
  let cyclingTravelInfo = {} as TravelResponse;
  if (places.some((place) => place.routingProfile === "walking")) {
    const walkingRes = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?access_token=${process.env.MAPBOX_API_KEY}`,
    );
    walkingTravelInfo = await walkingRes.json();
  }
  if (places.some((place) => place.routingProfile === "cycling")) {
    const cyclingRes = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${coordinates}?access_token=${process.env.MAPBOX_API_KEY}`,
    );
    cyclingTravelInfo = await cyclingRes.json();
  }

  const trips: TotalTravel[] = drivingTravelInfo.routes[0].legs.map(
    (leg: { distance: number; duration: number }, i: number) => {
      let { distance, duration } = leg;
      if (places[i].routingProfile === "walking") {
        distance = walkingTravelInfo.routes[0].legs[i].distance;
        duration = walkingTravelInfo.routes[0].legs[i].duration;
      }
      if (places[i].routingProfile === "cycling") {
        distance = cyclingTravelInfo.routes[0].legs[i].distance;
        duration = cyclingTravelInfo.routes[0].legs[i].duration;
      }
      return {
        distance: convertKmToMi(distance),
        duration: convertSecToMi(duration),
      };
    },
  );

  const totalDistance = trips.reduce((total, trip) => total + trip.distance, 0);
  const totalDuration = trips.reduce((total, trip) => total + trip.duration, 0);
  const totalTravel = {
    distance: totalDistance,
    duration: totalDuration,
  };
  const path = drivingTravelInfo.routes[0].geometry;

  return {
    trips,
    totalTravel,
    path,
  };
}

async function mapTravelInfo(
  places: RawPlaceData[],
  trips: TotalTravel[] | undefined,
): Promise<Omit<PlaceNoSchedule, "routingProfile">[]> {
  if (!trips) return places;
  else
    return places.map((place, i) => {
      const { routingProfile, ...placeProps } = place;
      const travel = trips[i] && { ...trips[i], routingProfile };
      return { ...placeProps, travel };
    });
}

export async function getTripInfo(tripId: string) {
  const supabase = createClient();

  try {
    const { data: tripNameData, error: tripNameError } = await supabase
      .from("trips")
      .select("name, timezone, sharing, sharingId:sharing_id")
      .eq("id", tripId)
      .limit(1)
      .single();
    if (tripNameError) throw new Error(`${tripNameError.message}`);
    const {
      name: tripName,
      timezone,
      sharing: isTripShared,
      sharingId,
    } = tripNameData;

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
      sharingId,
    };
  } catch (error) {
    console.log(error);
  }
}

function mapSchedule(places: PlaceNoSchedule[], startTime: Date): Place[] {
  let arrival = startTime;
  let departure;

  const calculatedPlaces = places.map((place) => {
    const { placeDuration: duration, ...placeProps } = place;
    departure = addMinutes(arrival, duration);
    const schedule = { arrival, duration, departure };
    const updatedPlace = { ...placeProps, schedule };
    arrival = addMinutes(departure, place.travel?.duration || 0);
    return updatedPlace;
  });

  return calculatedPlaces;
}
