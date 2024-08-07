"use server";

import { Place } from "@/types";
import { mapId } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { createClient as createClientJS } from "@supabase/supabase-js";
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
  } catch (error) {
    console.log(error);
    return {
      title: "Oops, something went wrong.",
      description: "There was a problem with your request.",
    };
  }
}

// I made two separate clients because I can only delete a user using the JS client
// Also using two means I can log out and stil delete the user
export async function deleteAccount() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  try {
    if (!userId) throw new Error("Could not find user id.");
    const supabaseJS = createClientJS(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_KEY as string,
    );
    await deleteData();
    await supabase.auth.signOut();
    const { error } = await supabaseJS.auth.admin.deleteUser(userId);
    if (error) throw new Error(error.message);
    return { description: "Your account and data have been deleted." };
  } catch (error) {
    console.log(error);
    return {
      title: "Oops, something went wrong",
      description: "There was a problem with your request.",
    };
  }
}
