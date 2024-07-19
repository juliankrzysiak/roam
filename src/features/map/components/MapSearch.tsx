"use client";

import { currentPlaceAtom } from "@/lib/atom";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

// Main template stolen from https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete
export default function MapSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const setCurrentPlace = useSetAtom(currentPlaceAtom);
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["place_id", "geometry"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
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
      setCurrentPlace(currentPlace);
      resetInput();
    });
  }, [placeAutocomplete]);

  function resetInput() {
    if (!inputRef.current) return;
    inputRef.current.value = "";
  }

  return (
    <div className="absolute left-1/2 top-4 w-full max-w-xl -translate-x-1/2 px-2">
      <input
        ref={inputRef}
        type="search"
        placeholder="Search location"
        className={clsx(
          "w-full rounded-lg border-2 border-emerald-900 px-2 py-1",
        )}
      />
    </div>
  );
}
