"use client";

import { Button } from "@/components/ui/button";
import { useCurrentPlaceStore } from "@/lib/store";
import { Day, Place } from "@/types";
import { createPlace } from "@/utils/actions/crud/create";
import { deletePlace } from "@/utils/actions/crud/delete";
import {
  APIProvider,
  AdvancedMarker,
  AdvancedMarkerRef,
  Map as GoogleMap,
  MapMouseEvent,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useSWR, { Fetcher } from "swr";

/* -------------------------------------------------------------------------- */
/*                                     Map                                    */
/* -------------------------------------------------------------------------- */

type MapProps = {
  day: Day;
  children: React.ReactNode;
};

export default function Map({ day, children }: MapProps) {
  const { places } = day;
  const [currentPlace, updateCurrentPlace, resetCurrentPlace] =
    useCurrentPlaceStore((state) => [
      state.currentPlace,
      state.updateCurrentPlace,
      state.reset,
    ]);
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
  }, [day.id]);

  function handleMapClick(e: MapMouseEvent) {
    const { placeId, latLng: position } = e.detail;
    if (!position || !placeId) resetCurrentPlace();
    else updateCurrentPlace({ currentPlace: { placeId, position } });
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
        disableDefaultUI
      >
        {children}
        <Markers places={places} />
        {currentPlace && <InfoWindow date={day.date} dayId={day.id} />}
      </GoogleMap>
    </APIProvider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Info Window                                */
/* -------------------------------------------------------------------------- */

// ! Fix optional api properties like opening hours and ratings
type PlaceDetails = {
  id: string;
  displayName: { languageCode: string; text: string };
  primaryTypeDisplayName?: { languageCode: string; text: string };
  shortFormattedAddress: string;
  regularOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions: string[];
  };
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  googleMapsUri: string;
};

const placeDetailsFetcher: Fetcher<PlaceDetails, string> = (id) =>
  fetch(
    `https://places.googleapis.com/v1/places/${id}?fields=id,displayName,primaryTypeDisplayName,shortFormattedAddress,regularOpeningHours,rating,userRatingCount,websiteUri,googleMapsUri&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
  ).then((res) => res.json());

type InfoWindowProps = {
  date: Day["date"];
  dayId: Day["id"];
};

function InfoWindow({ date, dayId: day_id }: InfoWindowProps) {
  const [currentPlace, resetCurrentPlace] = useCurrentPlaceStore((state) => [
    state.currentPlace,
    state.reset,
  ]);
  const advancedMarkerRef = useRef<AdvancedMarkerRef>(null);
  const map = useMap();

  useEffect(() => {
    advancedMarkerRef?.current?.addEventListener("click", (e) => {
      console.log(e);
    });
    if (!map || !currentPlace?.position) return;
    map.panTo(currentPlace.position);
  }, []);

  const { data, error, isLoading } = useSWR(
    currentPlace?.placeId,
    placeDetailsFetcher,
  );
  if (error || !data) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  async function handleCreatePlace() {
    const name = data?.displayName.text ?? "";
    if (!currentPlace) return;
    const {
      placeId: place_id,
      position: { lng, lat },
    } = currentPlace;
    if (!place_id) return;
    const payload = { name, day_id, lng, lat, place_id };

    await createPlace(payload);
    resetCurrentPlace();
  }

  async function handleDeletePlace() {
    if (!currentPlace?.id) return;
    await deletePlace(currentPlace.id);
    resetCurrentPlace();
  }

  return (
    <AdvancedMarker
      className="font-['Nunito Sans'] mb-8 flex flex-col gap-2 rounded-lg bg-slate-50 p-4 shadow-lg"
      position={currentPlace?.position}
      onClick={(e) => e.stop()}
      ref={advancedMarkerRef}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            {data.displayName.text}
          </h2>
          <button onClick={resetCurrentPlace} aria-label="Close info window">
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
          {data.rating && (
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
          )}
          <OpeningHours
            regularOpeningHours={data.regularOpeningHours}
            date={date}
          />
        </div>
        <div className="mb-2 flex gap-1 text-slate-500">
          {data.websiteUri && (
            <>
              <a href={data.websiteUri} className="underline">
                Website
              </a>
              •
            </>
          )}
          <a href={data.googleMapsUri} className="underline">
            Google Maps
          </a>
        </div>
      </div>
      {currentPlace?.id ? (
        <Button onClick={handleDeletePlace}>Delete place</Button>
      ) : (
        <Button onClick={handleCreatePlace}>Add place</Button>
      )}
    </AdvancedMarker>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Opening Hours                               */
/* -------------------------------------------------------------------------- */

type OpeningHoursProps = {
  regularOpeningHours: PlaceDetails["regularOpeningHours"] | undefined;
  date: Day["date"];
};

function OpeningHours({ regularOpeningHours, date }: OpeningHoursProps) {
  // TODO: Return nothing if opening hours not there
  const [isOpen, setIsOpen] = useState(false);
  if (!regularOpeningHours) return null;

  const todayIndex = date.getDay() - 1;
  const days = regularOpeningHours.weekdayDescriptions.map((desc) => {
    const [day, time] = desc.split(" ");
    const truncatedDay = day.slice(0, 3) + ":";
    return [truncatedDay, time];
  });
  const today = regularOpeningHours.weekdayDescriptions.at(todayIndex);

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      {isOpen ? (
        <table className="table-auto" onClick={toggleIsOpen}>
          <tbody>
            {days.map((desc, i) => {
              return (
                <tr
                  key={i}
                  className={`${
                    i === todayIndex ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  <td className="pr-1">{desc[0]}</td>
                  <td>{desc[1]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

/* -------------------------------------------------------------------------- */
/*                                   Markers                                  */
/* -------------------------------------------------------------------------- */

type MarkersProps = {
  places: Place[];
};

function Markers({ places }: MarkersProps) {
  const updateCurrentPlace = useCurrentPlaceStore(
    (state) => state.updateCurrentPlace,
  );
  const handleClick = (place: Place) => {
    const { id, position } = place;
    const placeId = place.placeId;
    const currentPlace = { id, placeId, position };
    updateCurrentPlace({ currentPlace });
  };

  return (
    <>
      {places.map((place, i) => (
        <AdvancedMarker
          key={place.id}
          position={place.position}
          clickable={true}
          onClick={() => handleClick(place)}
        >
          <Pin>{i + 1}</Pin>
        </AdvancedMarker>
      ))}
    </>
  );
}
