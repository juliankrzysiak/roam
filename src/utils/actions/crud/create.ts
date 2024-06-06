"use server";

import { Place, Popup } from "@/types";
import { parseDate, sliceDate } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { add } from "date-fns";
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
    const bulkDates = formatBulkDates(tripId, dates);
    
    await supabase.from("days").insert(bulkDates);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

function formatBulkDates(trip_id: number, dates: Date[]) {
  return dates.map((date) => ({ trip_id, date }));
}

export async function createDays(tripId: number, dates: Date[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  function formatBulkDates(dates: Date[], tripId: number) {
    return dates.map((date) => {
      tripId: tripId, date;
    });
  }

  try {
    const { data, error } = await supabase
      .from("days")
      .insert({ trip_id: tripId, date: nextDay });
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/maps");
    return data.id;
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
