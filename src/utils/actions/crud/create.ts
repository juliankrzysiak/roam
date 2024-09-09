"use server";

import { Place } from "@/types";
import { formatBulkDates, mapId } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createTrip(
  name: string,
  dates: Date[],
  timezone: string,
) {
  const supabase = createClient();

  try {
    const tripId = uuidv4();
    const bulkDates = formatBulkDates(tripId, dates, timezone);
    // Saving the first date as the current date of the trip
    const firstDate = bulkDates[0].date;

    const payload = {
      id: tripId,
      name,
      current_date: firstDate,
      timezone,
    };

    const { error } = await supabase
      .from("trips")
      .insert(payload)
      .select()
      .limit(1)
      .single();

    await supabase.from("days").insert(bulkDates);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

type NewPlace = {
  name: string;
  lng: number;
  lat: number;
  day_id: string;
  place_id: string;
  address: string;
};

export async function createPlace(newPlace: NewPlace, places: Place[]) {
  const supabase = createClient();

  try {
    const { data: place, error } = await supabase
      .from("places")
      .insert(newPlace)
      .select("id")
      .limit(1)
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);

    const order_places = [...mapId(places), place.id];

    const { error: orderError } = await supabase
      .from("days")
      .update({ order_places })
      .eq("id", newPlace.day_id);
    if (orderError) throw new Error(`Supabase error: ${orderError.message}`);

    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}
