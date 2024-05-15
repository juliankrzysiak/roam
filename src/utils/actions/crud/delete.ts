"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deletePlace(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { error } = await supabase.from("places").delete().eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const id = formData.get("tripId");

  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw new Error(`Supabase error: ${error.message}`);
  revalidatePath("/trips");
}

export async function deleteDay(dayId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);


  try {
    const { error } = await supabase
      .from("days")
      .delete()
      .eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}
