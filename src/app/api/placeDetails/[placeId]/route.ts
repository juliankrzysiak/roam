export async function GET(
  _request: Request,
  { params }: { params: { placeId: string } },
) {
  const { placeId } = params;
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,primaryTypeDisplayName,shortFormattedAddress,regularOpeningHours,rating,userRatingCount,websiteUri,googleMapsUri&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return Response.json(data);
}
