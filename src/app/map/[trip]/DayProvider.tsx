"use client";

import { DayInfo, PlaceT } from "@/types";
import { useState, createContext, useRef } from "react";
import Planner from "@/features/planner/components";
import Map from "@/features/map/components";
import { MapRef } from "react-map-gl";

export const DayContext = createContext({});

type Props = {
  places: PlaceT[];
  dayInfo: DayInfo;
  tripId: number;
};

export default function DayProvider({ places, dayInfo, tripId }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PlaceT | null>(null);



  return (
    <DayContext.Provider value={dayInfo}>
      <main className="relative flex h-40 flex-grow">
        <Planner places={places} dayInfo={dayInfo} tripId={tripId} />
        <Map
          places={places}
          dayInfo={dayInfo}
          popupInfo={popupInfo}
          setPopupInfo={setPopupInfo}
          mapRef={mapRef}
        />
      </main>
    </DayContext.Provider>
  );
}
