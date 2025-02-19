"use server";

import { Place } from "@/types";
import { mapId } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteCookie } from "../cookies";

type DeletePlacesArgs = {
  placesToDelete: string[];
  places: Place[];
  dayId: string;
};

export async function deletePlaces({
  placesToDelete,
  places,
  dayId,
}: DeletePlacesArgs) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("places")
      .delete()
      .in("id", placesToDelete);
    if (error) throw new Error(`Supabase error: ${error.message}`);

    const order_places = mapId(places).filter(
      (id) => !placesToDelete.includes(id),
    );
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

export async function resetTravelInfo(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  try {
    const { error } = await supabase
      .from("places")
      .update({
        travel_duration: null,
        travel_distance: null,
        is_travel_manual: false,
      })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/planner/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}
