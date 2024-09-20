"use client";

import { Input } from "@/components/ui/input";
import { useExit } from "@/features/planner/hooks";
import { currentPlaceAtom } from "@/lib/atom";
import {
  ControlPosition,
  MapControl,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { useSetAtom } from "jotai";
import { LocateFixed, Route, RouteOff, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = { path: boolean; handlePath: () => void };

export default function MapControls({ path, handlePath }: Props) {
  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="flex flex-col items-end gap-4 pr-4 pt-3">
        <MapSearch />
        <TogglePathButton path={path} handlePath={handlePath} />
        <CurrentLocationButton />
      </div>
    </MapControl>
  );
}

// Main template stolen from https://github.com/visgl/react-google-maps/tree/main/examples/autocomplete
function MapSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const places = useMapsLibrary("places");
  const setCurrentPlace = useSetAtom(currentPlaceAtom);
  const [open, setOpen] = useState(false);
  useExit(inputRef, () => setOpen(false));

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

  return (
    <div className="flex h-10 items-center">
      {open ? (
        <Input
          className="w-72 border-2 border-emerald-800 md:w-96"
          ref={inputRef}
          type="search"
          placeholder="Search for a place"
          autoFocus
        />
      ) : (
        <button
          className="rounded-full border-2 border-emerald-800 bg-slate-50 p-2"
          onClick={() => setOpen(true)}
          aria-label="Search location"
        >
          {open ? <X size={18} /> : <Search size={18} />}
        </button>
      )}
    </div>
  );
}

function TogglePathButton({ path, handlePath }: Props) {
  return (
    <button
      className="rounded-full border-2 border-emerald-800 bg-slate-50 p-1"
      onClick={handlePath}
      aria-label="Toggle route lines"
    >
      {path ? <RouteOff /> : <Route />}
    </button>
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
      className="mr-[2px] rounded-full border-2 border-emerald-800 bg-slate-50 p-1"
      onClick={handleClick}
      aria-label="Center on current position"
    >
      <LocateFixed size={18} />
    </button>
  );
}
