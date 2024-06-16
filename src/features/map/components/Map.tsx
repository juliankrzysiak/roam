"use client";

import { Day, Place } from "@/types";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useState } from "react";

type MapProps = {
  day: Day;
};

export default function Map({ day }: MapProps) {
  const { places } = day;
  const [currentPlace, setCurrentPlace] = useState<currentPlace | null>(null);
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    { lat: -34, lng: 118 },
  );

  useEffect(() => {
    if (places.length) {
      const { position } = places[0];
      setDefaultCenter(position);
    } else
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setDefaultCenter({ lat, lng });
      });
  }, []);

  // const { data, error, isLoading } = useSWR(
  //   currentPlace &&
  //     `${currentPlace.id}?fields=id,displayName,formattedAddress,currentOpeningHours,websiteUri&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  //   fetcher,
  // );
  // if (error) return <div>failed to load</div>;
  // if (isLoading) return <div>loading...</div>;

  function handleClick(e: MapMouseEvent) {
    const { placeId, latLng } = e.detail;
    if (!latLng || !placeId) setCurrentPlace(null);
    else {
      setCurrentPlace({ id: placeId, position: latLng });
    e.map.panTo(latLng);
    }
    e.stop();
  }

  function handleAdvancedMarkerClick(e: google.maps.MapMouseEvent) {
    e.stop();
  }

  function handleClose() {
    setCurrentPlace(null);
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        className="w-full"
        defaultZoom={13}
        defaultCenter={defaultCenter}
        mapId={"2b28f32837556830"}
        onClick={handleMapClick}
      >
        <Markers places={places} />
        {currentPlace && (
          <AdvancedMarker
            className="font-['Nunito Sans'] mb-8 flex gap-2 rounded-lg bg-slate-50 p-4 shadow-lg"
            position={currentPlace.position}
            onClick={handleAdvancedMarkerClick}
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">Pizza Box</h2>
              <h3 className="mb-2">40052 Westin Way, Palmdale</h3>
              <p>4.2 Stars</p>
              <a href="#">pizza.com</a>
            </div>
            <div className="flex flex-col items-end justify-between gap-2">
              <button onClick={handleClose} aria-label="Close info window">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="aspect-square h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <button>Add Place</button>
            </div>
          </AdvancedMarker>
        )}
      </GoogleMap>
    </APIProvider>
  );
}

function Markers({ places }: { places: Place[] }) {
  const map = useMap();
  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent) => {
      if (!map) return;
      if (!ev.latLng) return;
      map.panTo(ev.latLng);
    },
    [map],
  );

  return (
    <>
      {places.map((place, i) => (
        <AdvancedMarker
          key={place.id}
          position={place.position}
          clickable={true}
          onClick={handleClick}
        >
          <Pin>{i + 1}</Pin>
        </AdvancedMarker>
      ))}
    </>
  );
}
