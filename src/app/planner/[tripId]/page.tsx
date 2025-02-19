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
import { convertKmToMi, convertSecToMi, formatTripData } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import type { Metadata, ResolvingMetadata } from "next";

export const metadata: Metadata = {
  title: "Planner",
};

type Props = {
  params: { tripId: string };
  searchParams: { sharing?: string };
};

export default async function PlannerPage({ params, searchParams }: Props) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { tripId } = params;
  const { sharing: sharingParamId } = searchParams;
  const tripInfo = await getTripInfo(tripId);
  if (!tripInfo) throw new Error("Couldn't connect to server.");
  const {
    name,
    timezone,
    dateRange,
    days,
    sharing: { isSharing, sharingId },
  } = tripInfo;
  const isShared = isSharing && sharingParamId === sharingId;
  if (!isShared && !session) throw new Error("No authorization.");

  const day = await getDay(tripId, timezone);
  const { error } = await supabase
    .from("days")
    .update({
      total_distance: day.travel.distance,
      total_duration: day.travel.duration,
    })
    .eq("id", day.id);
  if (error) throw new Error("Couldn't update info for the current day.");
  const totalDuration = day.places.reduce(
    (total, current) =>
      total + (current.travel?.duration || 0) + current.schedule.duration,
    0,
  );
  const datesWithPlaces = days.flatMap((day) =>
    day.orderPlaces.length ? day.date : [],
  );

  return (
    <>
      <main className="relative h-40 flex-grow sm:flex">
        <Planner
          day={day}
          tripId={tripId}
          tripName={name}
          totalDuration={totalDuration}
          dateRange={dateRange}
          isShared={isShared}
        />
        <Map
          tripId={tripId}
          day={day}
          isShared={isShared}
          dateRange={dateRange}
          datesWithPlaces={datesWithPlaces}
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
      "id, name, lat, lng, placeDuration:place_duration, placeId:place_id, address, notes, routingProfile:routing_profile, travelDuration:travel_duration, travelDistance:travel_distance, isManual:is_travel_manual",
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
      const hasTravelInfo =
        places[i].travelDistance && places[i].travelDuration;
      if (hasTravelInfo) {
        return {
          distance: places[i].travelDistance,
          duration: places[i].travelDuration,
        };
      }
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
      const { routingProfile, isManual, ...placeProps } = place;
      const travel = trips[i] && { ...trips[i], routingProfile, isManual };
      return { ...placeProps, travel };
    });
}

export async function getTripInfo(tripId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("trips")
      .select(
        "tripId:id, name, days (date, totalDuration:total_duration, totalDistance:total_distance, orderPlaces:order_places), currentDate:current_date, isSharing: is_sharing, sharingId:sharing_id, timezone",
      )
      .eq("id", tripId)
      .order("date", { referencedTable: "days" })
      .limit(1)
      .single();
    if (error) throw new Error(`${error.message}`);
    const trip = formatTripData(data);

    return trip;
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
