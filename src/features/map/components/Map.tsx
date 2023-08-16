"use client";

import useMapLoader from "../hooks/useMapLoader";

export default function Map() {
  useMapLoader();

  return <section className="h-full " id="map"></section>;
}
