"use server";

import { Popup } from "@/types";
import { formatBulkDates } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function createTrip(name: string, dates: Date[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

export async function createPlace(place: Popup, day_id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const placeWithId = { ...place, day_id };

  try {
    const { error } = await supabase.from("places").insert(placeWithId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}
