"use client";

import { currentPlaceAtom } from "@/lib/atom";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { LocateFixed, Search, X } from "lucide-react";
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
  }, [places, open]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
      const placeId = place.place_id;
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
    <div className="absolute top-4 flex w-full  justify-between gap-2 px-4">
      <div></div>
      {open && (
        <input
          ref={inputRef}
          autoFocus
          type="search"
          placeholder="Search location"
          className={clsx(
            "h-fit w-full max-w-xl rounded-lg border-2 border-emerald-900 px-2 py-1",
          )}
        />
      )}
      <div className="flex flex-col items-center gap-4">
        <button
          className="rounded-full border-2 border-emerald-900 bg-slate-50 p-2"
          onClick={handleClick}
        >
          {open ? <X size={18} /> : <Search size={18} />}
        </button>
        <CurrentLocationButton />
      </div>
    </div>
  );
}

function CurrentLocationButton() {
  const map = useMap();
  function handleClick() {
    if (!map) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      map.panTo({ lat, lng });
    });
  }
  return (
    <button
      className="w-fit rounded-full border-2 border-emerald-900 bg-slate-50 p-1"
      onClick={handleClick}
    >
      <LocateFixed size={18} />
    </button>
  );
}
