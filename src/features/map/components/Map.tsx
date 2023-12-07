"use client";

import { mapConfig } from "@/config";
import { loadMap } from "../utils/loadMap";

export default function Map() {
  loadMap(mapConfig);

  return <section className="h-full" id="map"></section>;
}
