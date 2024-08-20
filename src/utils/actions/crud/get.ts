"use server";

import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export async function getAlertDates(tripId: string, datesToBeDeleted: Date[]) {
  if (!datesToBeDeleted.length) return;
  const supabase = createClient();
  // !: May need to convert this to timezone in the future
  const formattedDates = datesToBeDeleted.map((day) =>
    format(day, "yyyy-MM-dd"),
  );

  try {
    const { data, error } = await supabase
      .from("days")
      .select("date, orderPlaces:order_places, timezone")
      .eq("trip_id", tripId)
      .in("date", formattedDates);
    if (error) throw new Error(error.message);

    const alertDates = data
      .filter(({ orderPlaces }) => orderPlaces.length)
      .map((day) => formatInTimeZone(day.date, day.timezone, "MMM dd"));
    return alertDates;
  } catch (error) {
    console.log(error);
  }
}
