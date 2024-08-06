"use server";

import { Place } from "@/types";
import { mapId } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/[trip]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTrip(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("tripId");
  if (!id) return;

  try {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
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

export async function deleteData() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  try {
    if (!userId) throw new Error();
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("user_id", userId);
    if (error) throw new Error();
    return { description: "Your data has been deleted." };
  } catch {
    return {
      title: "Oops, something went wrong.",
      description: "There was a problem with your request.",
    };
  }
}

export async function deleteAccount() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (!userId)
    return {
      title: "Oops, something went wrong",
      description: "There was a problem with your request.",
    };
  const { error } = await supabase.from("trips").delete().eq("user_id", userId);
  if (error)
    return {
      title: "Oops, something went wrong",
      description: "There was a problem with your request.",
    };
  return { description: "Your data has been deleted." };
}
