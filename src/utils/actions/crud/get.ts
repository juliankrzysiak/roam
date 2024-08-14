"use server";

import { Day, Place, PlaceNoSchedule, Travel } from "@/types";
import { Database } from "@/types/supabase";
import { calcDateRange, convertKmToMi, convertSecToMi } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { addMinutes, format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export async function getDay(
  tripId: string,
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

  const date = parseISO(dayData.date + "T" + dayData.startTime);
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
    `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?overview=full&geometries=polyline&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
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

export async function getAlertDates(tripId: string, datesToBeDeleted: Date[]) {
  if (!datesToBeDeleted.length) return;
  const supabase = createClient();
  // !: May need to convert this to timezone in the future
  const formattedDates = datesToBeDeleted.map((day) =>
    format(day, "yyyy-MM-dd"),
  );

  try {
    const { data, error } = await supabase
      .from("days")
      .select("date, orderPlaces:order_places, timezone")
      .eq("trip_id", tripId)
      .in("date", formattedDates);
    if (error) throw new Error(error.message);

    const alertDates = data
      .filter(({ orderPlaces }) => orderPlaces.length)
      .map((day) => formatInTimeZone(day.date, day.timezone, "MMM dd"));
    return alertDates;
  } catch (error) {
    console.log(error);
  }
}

export async function getTripInfo(tripId: string) {
  const supabase = createClient();

  try {
    const { data: tripNameData, error: tripNameError } = await supabase
      .from("trips")
      .select("name, timezone")
      .eq("id", tripId)
      .limit(1)
      .single();
    if (tripNameError) throw new Error(`${tripNameError.message}`);
    const { name: tripName, timezone } = tripNameData;

    const { data: daysData, error: daysError } = await supabase
      .from("days")
      .select("date, orderPlaces:order_places")
      .eq("trip_id", tripId)
      .order("date");
    if (daysError) throw new Error(`${daysError.message}`);
    const dateRange = calcDateRange(daysData);

    return {
      tripName,
      timezone,
      dateRange,
    };
  } catch (error) {
    console.log(error);
  }
}
