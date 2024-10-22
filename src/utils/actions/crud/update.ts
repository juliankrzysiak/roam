"use server";

import { Place, Travel } from "@/types";
import { convertTime, formatBulkDates, mapId } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export async function updateTrip(id: string, name: string) {
  const supabase = createClient();

  try {
    if (typeof name !== "string") return;
    const { error } = await supabase
      .from("trips")
      .update({ name })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

export async function updateTripDates(
  tripId: string,
  ranges: [Date[], Date[]],
  timezone: string,
) {
  const supabase = createClient();
  const [daysToAdd, daysToRemove] = ranges;

  if (daysToAdd.length) {
    const bulkDates = formatBulkDates(tripId, daysToAdd, timezone);
    try {
      const { error } = await supabase.from("days").insert(bulkDates);
      if (error) throw new Error(`Supabase error: ${error.message}`);
      revalidatePath("/trips");
    } catch (error) {
      console.log(error);
    }
  }

  if (daysToRemove.length) {
    const formattedDates = daysToRemove.map((date) =>
      format(date, "yyy-MM-dd"),
    );

    try {
      const { error } = await supabase
        .from("days")
        .delete()
        .eq("trip_id", tripId)
        .in("date", formattedDates);
      if (error) throw new Error(`Supabase error: ${error.message}`);
      revalidatePath("/trips");
    } catch (error) {
      console.log(error);
    }
  }
}

export async function updatePlaceDuration(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const hours = Number(formData.get("hours"));
  const minutes = Number(formData.get("minutes"));
  const { minutes: place_duration } = convertTime({ hours, minutes });

  try {
    const { error } = await supabase
      .from("places")
      .update({ place_duration })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateTripDuration(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const hours = Number(formData.get("hours"));
  const minutes = Number(formData.get("minutes"));
  const { minutes: travel_duration } = convertTime({ hours, minutes });

  try {
    const { error } = await supabase
      .from("places")
      .update({ travel_duration })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateStartTime(formData: FormData) {
  const supabase = createClient();

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const startTime = formData.get("startTime") as string;

  try {
    const { error } = await supabase
      .from("days")
      .update({ start_time: startTime })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updatePlaceOrder(order_places: string[], dayId: string) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("days")
      .update({ order_places })
      .eq("id", dayId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateCurrentDate(tripId: string, date: Date) {
  const supabase = createClient();
  const current_date = date.toISOString();

  try {
    const { error } = await supabase
      .from("trips")
      .update({ current_date })
      .eq("id", tripId);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateNotes(formData: FormData) {
  const supabase = createClient();

  const notes = formData.get("notes") as string;
  const initialNotes = formData.get("initialNotes") as string;
  const id = formData.get("id") as string;
  if (initialNotes === notes) return;

  try {
    const { error } = await supabase
      .from("places")
      .update({ notes })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateName(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;
  const id = formData.get("id") as string;

  try {
    const { error } = await supabase
      .from("places")
      .update({ name })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

type MovePlacesArgs = {
  placesToMove: string[];
  places: Place[];
  currentDayId: string;
  newDate: string;
  tripId: string;
};

// TODO: Replace with rpc
export async function movePlaces({
  placesToMove,
  places,
  currentDayId,
  newDate,
  tripId,
}: MovePlacesArgs) {
  const supabase = createClient();
  try {
    const { data: newDayData, error: newDayError } = await supabase
      .from("days")
      .select("id, order_places")
      .match({ trip_id: tripId, date: newDate })
      .limit(1)
      .single();
    if (newDayError) throw new Error(newDayError.message);

    const { id: newDayId, order_places: newDayOrderPlaces } = newDayData;

    const { error: updatePlacesError } = await supabase
      .from("places")
      .update({ day_id: newDayId })
      .in("id", placesToMove);
    if (updatePlacesError) throw new Error(updatePlacesError.message);

    const updatedCurrentDayOrderPlaces = mapId(places).filter(
      (id) => !placesToMove.includes(id),
    );
    const updatedNewDayOrderPlaces = newDayOrderPlaces.concat(placesToMove);

    const { error: updateCurrentDayError } = await supabase
      .from("days")
      .update({ order_places: updatedCurrentDayOrderPlaces })
      .eq("id", currentDayId);
    if (updateCurrentDayError) throw new Error(updateCurrentDayError.message);

    const { error: updateNewDayError } = await supabase
      .from("days")
      .update({ order_places: updatedNewDayOrderPlaces })
      .eq("id", newDayId);
    if (updateNewDayError) throw new Error(updateNewDayError.message);

    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}

export async function updateSharing(is_sharing: boolean, tripId: string) {
  const supabase = createClient();
  try {
    await supabase.from("trips").update({ is_sharing }).eq("id", tripId);
    revalidatePath("/trips");
  } catch (error) {
    console.log(error);
  }
}

export async function updateSharingId(tripId: string) {
  const supabase = createClient();
  const sharing_id = uuidv4();

  try {
    const { data, error } = await supabase
      .from("trips")
      .update({ sharing_id })
      .eq("id", tripId)
      .select("sharing_id")
      .single();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    return data.sharing_id;
  } catch (error) {
    console.log(error);
  }
}

export async function updateRoutingProfile(formData: FormData) {
  const supabase = createClient();
  const routing_profile = formData.get(
    "routingProfile",
  ) as Travel["routingProfile"];
  const id = formData.get("id") as string;

  try {
    const { error } = await supabase
      .from("places")
      .update({ routing_profile })
      .eq("id", id);
    if (error) throw new Error(`Supabase error: ${error.message}`);
    revalidatePath("/[tripId]", "page");
  } catch (error) {
    console.log(error);
  }
}
