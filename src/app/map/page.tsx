"use client";

import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components";
import { Place } from "@/types/types";
import { useState } from "react";

export default function MapPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  return (
    <main className="relative h-20 flex-grow">
      <Map places={places} setPlaces={setPlaces} />
      <Planner places={places} setPlaces={setPlaces} />
    </main>
  );
}
