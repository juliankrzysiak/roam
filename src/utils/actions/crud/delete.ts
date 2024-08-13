"use server";

import { Place } from "@/types";
import { mapId } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteCookie } from "../cookies";

export async function deletePlace(
  places: Place[],
  placeId: string,
  dayId: string,
) {
  const supabase = createClient();
  try {
    const { error } = await supabase.from("places").delete().eq("id", placeId);
    if (error) throw new Error(`Supabase error: ${error.message}`);

    const order_places = mapId(places.filter((place) => place.id !== placeId));

    const { error: orderError } = await supabase
      .from("days")
      .update({ order_places })
      .eq("id", dayId);
    if (orderError) throw new Error(`Supabase error: ${orderError.message}`);

    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTrip(formData: FormData) {
  const supabase = createClient();

  const tripId = formData.get("tripId");
  if (typeof tripId !== "string") return;

  try {
    const { error } = await supabase.from("trips").delete().eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    deleteCookie("tripId");
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteDay(dayId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase.from("days").delete().eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}
