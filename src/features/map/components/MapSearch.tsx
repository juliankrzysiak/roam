"use client";

import { currentPlaceAtom } from "@/lib/atom";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Main template stolen from https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete
export default function MapSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
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

  function handleClick() {
    setOpen(!open);
  }

  return (
    <div className="absolute top-4 flex w-full justify-between gap-2 px-2">
      <div></div>
      {open && (
        <input
          ref={inputRef}
          autoFocus
          type="search"
          placeholder="Search location"
          className={clsx(
            "w-full max-w-xl rounded-lg border-2 border-emerald-900 px-2 py-1 transition-opacity",
            !open && "opacity-0",
          )}
        />
      )}

      <button
        className="rounded-full border-2 border-emerald-900 bg-slate-50 p-2"
        onClick={handleClick}
      >
        {open ? <X size={18} /> : <Search size={18} />}
      </button>
    </div>
  );
}
