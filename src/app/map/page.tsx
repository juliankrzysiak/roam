"use client";

import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components";
import { PlaceT } from "@/types";
import { useState } from "react";

export default function MapPage() {
  const [places, setPlaces] = useState<PlaceT[]>([]);
  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} setPlaces={setPlaces} />
      <Planner places={places} setPlaces={setPlaces} />
    </main>
  );
}
