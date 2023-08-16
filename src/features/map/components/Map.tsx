"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect } from "react";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
  version: "weekly",
});

export default function Map() {
  useEffect(() => {
    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps",
      )) as google.maps.MapsLibrary;
      new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    });
  });

  return <div className="h-full flex-auto" id="map"></div>;
}
