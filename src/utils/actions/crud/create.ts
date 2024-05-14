"use server";

import { PlaceT } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { add, formatISO, parse } from "date-fns";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const name = formData.get("name");

  try {
    if (typeof name !== "string") return;
    const { data, error } = await supabase
      .from("trips")
      .insert({ name })
      .select()
      .limit(1)
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
    return data.id;
  } catch (error) {
    console.log(error);
  }
}

export async function createDay(tripId: number, date: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const nextDay = formatISO(
    add(parse(date, "yyyy-MM-dd", new Date()), { days: 1 }),
  ).slice(0, 10);

  try {
    const { data, error } = await supabase
      .from("days")
      .insert({ trip_id: tripId, date: nextDay })
      .select("id")
      .limit(1)
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/maps");
    return data.id;
  } catch (error) {
    console.log(error);
  }
}

export async function createPlace(place: PlaceT & { day_id: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase.from("places").insert(place);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}
