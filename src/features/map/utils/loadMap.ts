import { Loader } from "@googlemaps/js-api-loader";

export function loadMap(config: google.maps.MapOptions) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (typeof apiKey !== "string") throw new Error("No api key provided.");

  const loader = new Loader({
    apiKey,
    version: "weekly",
  });

  loader.load().then(async () => {
    const { Map } = (await google.maps.importLibrary(
      "maps",
    )) as google.maps.MapsLibrary;

    new Map(document.getElementById("map") as HTMLElement, config);
  });
}
