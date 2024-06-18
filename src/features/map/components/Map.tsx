"use client";

import { Button } from "@/components/ui/button";
import { Day, Place } from "@/types";
import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  MapMouseEvent,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { ChevronsUpDown } from "lucide-react";
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
  primaryTypeDisplayName?: { languageCode: string; text: string };
  shortFormattedAddress: string;
  regularOpeningHours: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  rating: number;
  userRatingCount: number;
  websiteUri: string;
  googleMapsUri: string;
};

const placeDetailsFetcher: Fetcher<PlaceDetails, string> = (id) =>
  fetch(
    `https://places.googleapis.com/v1/places/${id}?fields=id,displayName,primaryTypeDisplayName,shortFormattedAddress,regularOpeningHours,rating,userRatingCount,websiteUri,googleMapsUri&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
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

  console.log(data);

  return (
    <AdvancedMarker
      className="font-['Nunito Sans'] mb-8 flex flex-col gap-2 rounded-lg bg-slate-50 p-4 shadow-lg"
      position={currentPlace.position}
      onClick={handleClick}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            {data.displayName.text}
          </h2>
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
        </div>
        <h3 className=" text-sm text-slate-600">
          {data.shortFormattedAddress}
        </h3>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex flex-col">
          <span>{data?.primaryTypeDisplayName?.text || "place"}</span>
          <span className="flex items-center gap-1 text-sm">
            <span className="flex items-center">
              {data.rating}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="aspect-square h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </span>
            ({data.userRatingCount})
          </span>
          <OpeningHours regularOpeningHours={data.regularOpeningHours} />
        </div>
        <div className="mb-2 flex gap-1">
          <a href={data.websiteUri} className="underline">
            Website
          </a>
          •
          <a href={data.googleMapsUri} className="underline">
            Google Maps
          </a>
        </div>
      </div>
      <Button size="sm">Add Place</Button>
    </AdvancedMarker>
  );
}

type OpeningHoursProps = Pick<PlaceDetails, "regularOpeningHours">;

const todayIndex = new Date().getDay() - 1;

function OpeningHours({ regularOpeningHours }: OpeningHoursProps) {
  const [isOpen, setIsOpen] = useState(false);
  const today = regularOpeningHours.weekdayDescriptions.at(todayIndex);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      {isOpen ? (
        <ol onClick={toggleIsOpen}>
          {regularOpeningHours.weekdayDescriptions.map((desc) => {
            return (
              <li
                key={desc}
                className={`${
                  desc === today ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {desc}
              </li>
            );
          })}
        </ol>
      ) : (
        <button onClick={toggleIsOpen}>
          <span className="flex items-center gap-1">
            {today} <ChevronsUpDown size={16} />
          </span>
        </button>
      )}
    </div>
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
