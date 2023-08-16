"use client";

import { mapConfig } from "@/config";
import useMapLoader from "../hooks/useMapLoader";

export default function Map() {
  useMapLoader(mapConfig);

  return <section className="h-full " id="map"></section>;
}
