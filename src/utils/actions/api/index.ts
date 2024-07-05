"use server";
import { Place } from "@/types";

export async function searchText(formData: FormData) {
  const query = formData.get("search");
  if (!query || typeof query !== "string") return;

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env
            .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
          "X-Goog-FieldMask": "places.id",
        },
        body: JSON.stringify({ textQuery: query }),
      },
    );
    const { places } = await response.json();
    return places;
  } catch (error) {
    console.log(error);
  }
}

export async function getRoute(places: Place[]) {
  if (places.length < 2) return;
  const origin = places.at(0);
  const destination = places.at(-1);
  const intermediates = places.length > 2 ? places.slice(1, -1) : null;

  const body = JSON.stringify({
    origin: { placeId: origin?.placeId },
    destination: { placeId: destination?.placeId },
    languageCode: "en-US",
    units: "IMPERIAL",
  });

  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env
            .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
        },
        body,
      },
    );
    const route = await response.json();
    return route;
  } catch (error) {
    console.log(error);
  }
}
