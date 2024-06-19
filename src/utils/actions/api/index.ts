"use server";

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
