import { PlaceT } from "@/types";

export function parseOrder(places: PlaceT[]) {
  return places.map((place) => place.id);
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
