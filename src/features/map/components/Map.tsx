"use client";

import useMapLoader from "../hooks/useMapLoader";

export default function Map() {
  useMapLoader();
  return <div className="h-full flex-auto" id="map"></div>;
}
