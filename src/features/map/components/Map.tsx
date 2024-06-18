"use client";

import { usePlaceStore } from "@/lib/store";
import { Day, Place } from "@/types";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  MapMouseEvent,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import useSWR, { Fetcher } from "swr";

type MapProps = {
  day: Day;
};

type CurrentPlace = {
  id: string;
  position: google.maps.LatLngLiteral;
};

export default function Map({ day }: MapProps) {
  const { places } = day;
  const [currentPlace, setCurrentPlace] = useState<CurrentPlace | null>(null);
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

  function handleMapClick(e: MapMouseEvent) {
    const { placeId, latLng } = e.detail;
    if (!latLng || !placeId) setCurrentPlace(null);
    else {
      setCurrentPlace({ id: placeId, position: latLng });
      e.map.panTo(latLng);
    }
    e.stop();
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
          <InfoWindow
            currentPlace={currentPlace}
            setCurrentPlace={setCurrentPlace}
          />
        )}
      </GoogleMap>
    </APIProvider>
  );
}

type PlaceDetails = {
  id: string;
  displayName: { languageCode: string; text: string };
  shortFormattedAddress: string;
  regularOpeningHours: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  rating: number;
  websiteUri: string;
};

const placeDetailsFetcher: Fetcher<PlaceDetails, string> = (id) =>
  fetch(
    `https://places.googleapis.com/v1/places/${id}?fields=id,displayName,shortFormattedAddress,regularOpeningHours,rating,websiteUri&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  ).then((res) => res.json());

type InfoWindowProps = {
  currentPlace: CurrentPlace;
  setCurrentPlace: Dispatch<SetStateAction<CurrentPlace | null>>;
};

function InfoWindow({ currentPlace, setCurrentPlace }: InfoWindowProps) {
  const { data, error, isLoading } = useSWR(
    currentPlace.id,
    placeDetailsFetcher,
  );
  if (error || !data) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  function handleClick(e: google.maps.MapMouseEvent) {
    e.stop();
  }

  function handleClose() {
    setCurrentPlace(null);
  }

  return (
    <AdvancedMarker
      className="font-['Nunito Sans'] mb-8 flex gap-2 rounded-lg bg-slate-50 p-4 shadow-lg"
      position={currentPlace.position}
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">{data.displayName.text}</h2>
        <h3 className="text-md mb-2">{data.shortFormattedAddress}</h3>
        <p>{data.rating} Stars</p>
        <a href={data.websiteUri} className="underline">
          Website link
        </a>
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
  );
}

function Markers({ places }: { places: Place[] }) {
  const map = useMap();

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, place: Place) => {
      if (!map) return;
      if (!ev.latLng) return;
      map.panTo(ev.latLng);
      const { id, position } = place;
      usePlaceStore.setState({ id, position });
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
          onClick={(ev) => handleClick(ev, place)}
        >
          <Pin>{i + 1}</Pin>
        </AdvancedMarker>
      ))}
    </>
  );
}
