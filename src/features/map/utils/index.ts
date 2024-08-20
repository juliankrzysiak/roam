import { Fetcher } from "swr";
import { PlaceDetails } from "../types";

export const placeDetailsFetcher: Fetcher<PlaceDetails, string> = (
  placeId: string,
) => fetch(`/api/placeDetails/${[placeId]}`).then((res) => res.json());
