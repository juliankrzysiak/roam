"use client";

import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  MapCameraChangedEvent,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { Day, Place } from "@/types";
import { useRef, useState, useEffect, useCallback } from "react";

type MapProps = {
  day: Day;
};

export default function Map({ day }: MapProps) {
  const { places } = day;
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    { lat: -34, lng: 118 },
  );

  useEffect(() => {
    if (places.length) {
      const { lat, lng } = places[0];
      setDefaultCenter({ lat, lng });
    } else
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setDefaultCenter({ lat, lng });
      });
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <GoogleMap
        className="w-full"
        defaultZoom={13}
        defaultCenter={defaultCenter}
        mapId={"2b28f32837556830"}
      >
        <Markers places={places} />
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
      {places.map((place) => (
        <AdvancedMarker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          clickable={true}
          onClick={handleClick}
        >
          <Pin
            background={"#FBBC04"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
}
