"use client";

import { currentPlaceAtom } from "@/lib/atom";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import clsx from "clsx";
import { useSetAtom } from "jotai";
import { LocateFixed, Route, RouteOff, Search, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

// Main template stolen from https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete
type Props = { path: boolean; handlePath: () => void };

export default function MapSearch({ path, handlePath }: Props) {
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
    <div
      className={clsx(
        "absolute right-0 top-4 flex justify-between gap-2 px-4",
        open && "w-full",
      )}
    >
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
          aria-label="Search location"
        >
          {open ? <X size={18} /> : <Search size={18} />}
        </button>
        <TogglePathButton path={path} handlePath={handlePath} />
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
      aria-label="Center on current position"
    >
      <LocateFixed size={18} />
    </button>
  );
}

function TogglePathButton({ path, handlePath }: Props) {
  return (
    <button
      className="w-fit rounded-full border-2 border-emerald-900 bg-slate-50 p-1"
      onClick={handlePath}
      aria-label="Toggle route lines"
    >
      {path ? <RouteOff /> : <Route />}
    </button>
  );
}
