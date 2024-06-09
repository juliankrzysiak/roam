"use server";

import { Popup } from "@/types";
import { formatBulkDates } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTrip(name: string, dates: Date[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from("trips")
      .insert({ name })
      .select()
      .limit(1)
      .single();

    const tripId = data?.id;
    if (!tripId) throw new Error("Couldn't add dates to trip.");
    const bulkDates = formatBulkDates(tripId, dates);

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
