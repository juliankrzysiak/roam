import { PlaceT } from "@/types";
import { formatISO, parse } from "date-fns";
import { updatePlaceOrder } from "./actions/crud/update";

export async function reorderPlaces(
  oldPlaces: PlaceT[],
  newPlaces: PlaceT[],
  dayId: string,
) {
  const [oldOrder, newOrder] = [oldPlaces, newPlaces].map(parseOrder);
  // Don't want to invoke a server action when dragging and dropping to the same position
  if (checkEqualArrays(oldOrder, newOrder)) return;
  await updatePlaceOrder(newOrder, dayId);
}

export function parseOrder(places: PlaceT[]) {
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
