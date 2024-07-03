import { atom } from "jotai";

type CurrentPlace = {
  id?: string;
  placeId: string;
  position: google.maps.LatLngLiteral;
} | null;

export const currentPlaceAtom = atom<CurrentPlace>(null);

export const isPlannerVisibleAtom = atom(true);
