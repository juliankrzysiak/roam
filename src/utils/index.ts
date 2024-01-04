import { PlaceT } from "@/types";

export function parseOrder(places: PlaceT[]) {
  return places.map((place) => place.id);
}
