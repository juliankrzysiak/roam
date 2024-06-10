import { Place } from "@/types";
import { format, formatISO, parse } from "date-fns";
import { updatePlaceOrder } from "./actions/crud/update";

export async function reorderPlaces(
  oldPlaces: Place[],
  newPlaces: Place[],
  dayId: string,
) {
  const [oldOrder, newOrder] = [oldPlaces, newPlaces].map(parseOrder);
  // Don't want to invoke a server action when dragging and dropping to the same position
  if (checkEqualArrays(oldOrder, newOrder)) return;
  await updatePlaceOrder(newOrder, dayId);
}

export function parseOrder(places: Place[]) {
  return places.map((place) => place.id);
}

function checkEqualArrays(arr1: string[], arr2: string[]) {
  return arr1.join("") === arr2.join("");
}

type Args = { hours?: number; minutes: number };
// Converts to hours and minutes if only minutes given
// Converts to minutes if hours and minutes given
export function convertTime({ hours, minutes }: Args) {
  return {
    hours: Math.floor(minutes / 60),
    minutes: hours ? hours * 60 + minutes : minutes % 60,
  };
}

export function parseDate(date: string, format: string = "yyyy-MM-dd") {
  return parse(date, format, new Date());
}

export function sliceDate(date: Date, end: number = 10) {
  return formatISO(date).slice(0, end);
}

// Get what dates to add and remove comparing two arrays of dates]\

export function calcDateDeltas(oldArr: Date[], newArr: Date[]) {
  const removedItems = calcDateDelta(oldArr, newArr);
  const addedItems = calcDateDelta(newArr, oldArr);

  return [addedItems, removedItems];
}

function calcDateDelta(arr1: Date[], arr2: Date[]) {
  return arr1.filter(
    (date1) =>
      !arr2.some((date2) => date2.toUTCString() === date1.toUTCString()),
  );
}

//

export function formatBulkDates(trip_id: string, dates: Date[]) {
  return dates.map((date) => ({ trip_id, date: format(date, "yyyy-MM-dd") }));
}
