"use client";

import { useCurrentPlaceStore } from "@/lib/store";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Main template stolen from https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete
export default function MapSearch() {
  const [updateCurrentPlace, resetCurrentPlace] = useCurrentPlaceStore(
    (state) => [state.updateCurrentPlace, state.reset],
  );
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["place_id", "geometry"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    resetCurrentPlace();
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      const placeId = place.place_id;
      // Why do I need to call a function to get a number lol
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (!lat || !lng || !placeId) return;
      const currentPlace = { placeId, position: { lat, lng } };
      updateCurrentPlace({ currentPlace });
    });
  }, [updateCurrentPlace, placeAutocomplete]);

  return (
    <div className="absolute left-2 right-2 top-2 flex gap-2 rounded-lg bg-slate-100 p-2 shadow-lg">
      <input
        ref={inputRef}
        type="search"
        placeholder="Search location"
        className="w-full rounded-lg px-2"
      />
    </div>
  );
}
