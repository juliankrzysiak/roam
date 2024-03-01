"use server";

import { PlaceT } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Auth //

type AccountArgs = {
  name: string;
  email: string;
  emailChanged: boolean;
};

export async function updateAccount({
  name,
  email,
  emailChanged,
}: AccountArgs) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const payload: { [k: string]: any } = {
    data: { name },
  };

  if (emailChanged) {
    payload.email = email;
  }

  const { error } = await supabase.auth.updateUser(payload);
  if (error) {
    console.log(error);
    return error.message;
  }
}

export async function updatePassword(password: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    console.log(error);
    return error.message;
  }
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();
  if (error) console.log(error);
  redirect("/");
}

// Create //

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

export async function createDay(tripId: number) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data, error } = await supabase
      .from("days")
      .insert({ trip_id: tripId })
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

// Update //
export async function updateTrip(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const name = formData.get("name");
  const tripId = formData.get("tripId");

  try {
    if (typeof name !== "string") return;
    const { error } = await supabase
      .from("trips")
      .update({ name })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDuration(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const id = formData.get("id");
  const rawFormData = {
    duration: formData.get("duration"),
  };
  try {
    const { error } = await supabase
      .from("places")
      .update(rawFormData)
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateStartTime(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const rawFormData = {
    start_time: formData.get("startTime"),
  };
  // TODO: Add day here
  try {
    const { error } = await supabase
      .from("days")
      .update(rawFormData)
      .eq("id", 3);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDay(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const rawFormData = {
    day_id: formData.get("dayId"),
  };

  try {
    const { error } = await supabase
      .from("trips")
      .update(rawFormData)
      .eq("id", formData.get("tripId"));
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updatePlaceOrder(order: string[], dayId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error } = await supabase
      .from("days")
      .update({ order_places: order })
      .eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

export async function updateDayOrder(tripId: number, order: string[]) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // const rawFormData = {
  //   trip_id: formData.get("trip"),
  // };

  try {
    const { error } = await supabase
      .from("trips")
      .update({ order_days: order })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/map");
  } catch (error) {
    console.log(error);
  }
}

// Delete //

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
