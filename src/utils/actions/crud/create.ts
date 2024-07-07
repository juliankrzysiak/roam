"use server";

import { formatBulkDates } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function createTrip(name: string, dates: Date[]) {
  const supabase = createClient();

  try {
    const tripId = uuidv4();
    const bulkDates = formatBulkDates(tripId, dates);
    // Saving the first date as the current date of the trip
    const firstDate = bulkDates[0].date;

    const payload = {
      id: tripId,
      name,
      current_date: firstDate,
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

type CreatePlaceParams = {
  name: string;
  lng: number;
  lat: number;
  day_id: string;
  place_id: string;
};

export async function createPlace(payload: CreatePlaceParams) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("places")
      .insert(payload)
      .select("id")
      .limit(1)
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[trip]");
    return data.id;
  } catch (error) {
    console.log(error);
  }
}
