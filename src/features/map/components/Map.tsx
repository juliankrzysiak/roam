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
    if (!latLng || !placeId) return;
    e.map.panTo(latLng);
    e.stop();
  }

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
