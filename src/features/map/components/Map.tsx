"use client";

import { Button } from "@/components/ui/button";
import { IsSharedContext } from "@/context/IsSharedContext";
import { currentPlaceAtom, insertBeforeIdAtom } from "@/lib/atom";
import { DateRange, Day, Place } from "@/types";
import { createPlace } from "@/utils/actions/crud/create";
import { deletePlaces } from "@/utils/actions/crud/delete";
import {
  APIProvider,
  AdvancedMarker,
  AdvancedMarkerRef,
  Map as GoogleMap,
  MapMouseEvent,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronsUpDown, LoaderCircle, Star, X } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { PlaceDetails } from "../types";
import { placeDetailsFetcher } from "../utils";
import { Polyline } from "./Polyline";
import MapControls from "./MapControls";
import MapDatePicker from "./MapDatePicker";

/* -------------------------------------------------------------------------- */
/*                                     Map                                    */
/* -------------------------------------------------------------------------- */

type MapProps = {
  tripId: string;
  day: Day;
  isShared: boolean;
  dateRange: DateRange;
};

export default function Map({ tripId, day, isShared, dateRange }: MapProps) {
  const { places } = day;
  const [currentPlace, setCurrentPlace] = useAtom(currentPlaceAtom);
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>(
    { lat: 34, lng: -118 },
  );
  const [showPath, setShowPath] = useState(Boolean(day?.path));

  useEffect(() => {
    const savedLat = localStorage.getItem("lat");
    const savedLng = localStorage.getItem("lng");
    if (places.length) {
      const { position } = places[places.length - 1];
      setDefaultCenter(position);
    } else if (savedLat && savedLng) {
      const savedPosition = { lat: Number(savedLat), lng: Number(savedLng) };
      setDefaultCenter(savedPosition);
    } else
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setDefaultCenter({ lat, lng });
      });
  }, []);

  function handleMapClick(e: MapMouseEvent) {
    const { placeId, latLng: position } = e.detail;
    if (!position || !placeId) setCurrentPlace(null);
    else {
      setCurrentPlace({ placeId, position });
      localStorage.setItem("lat", position.lat.toString());
      localStorage.setItem("lng", position.lng.toString());
    }
    e.stop();
  }

  function handlePath() {
    setShowPath(!showPath);
  }

  return (
    <IsSharedContext.Provider value={isShared}>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      >
        <GoogleMap
          defaultZoom={12}
          defaultCenter={defaultCenter}
          mapId={"2b28f32837556830"}
          onClick={handleMapClick}
          fullscreenControl={false}
          reuseMaps
        >
          <MapControls path={showPath} handlePath={handlePath} />
          <MapDatePicker tripId={tripId} day={day} dateRange={dateRange} />
          <Markers places={places} />
          {currentPlace && (
            <InfoWindow date={day.date} dayId={day.id} places={places} />
          )}
          {showPath && (
            <Polyline
              strokeWeight={5}
              strokeColor={"#831843"}
              encodedPath={day.path}
            />
          )}
        </GoogleMap>
      </APIProvider>
    </IsSharedContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Info Window                                */
/* -------------------------------------------------------------------------- */

type InfoWindowProps = {
  date: Day["date"];
  dayId: Day["id"];
  places: Day["places"];
};

function InfoWindow({ date, dayId, places }: InfoWindowProps) {
  const isShared = useContext(IsSharedContext);
  const [currentPlace, setCurrentPlace] = useAtom(currentPlaceAtom);
  const insertBeforeId = useAtomValue(insertBeforeIdAtom);
  const advancedMarkerRef = useRef<AdvancedMarkerRef>(null);
  const map = useMap();

  useEffect(() => {
    if (!map || !currentPlace?.position) return;
    map.panTo(currentPlace.position);
    map.panBy(0, -150);
  }, [currentPlace?.placeId]);

  const {
    data: placeDetails,
    error,
    isLoading,
  } = useSWR(currentPlace?.placeId, placeDetailsFetcher);
  if (error) return <div>failed to load...</div>;

  async function handleCreatePlace() {
    if (!currentPlace || !placeDetails) return;
    const name = placeDetails.displayName.text;
    const address = placeDetails.shortFormattedAddress;
    const {
      placeId: place_id,
      position: { lng, lat },
    } = currentPlace;

    const newPlace = { name, day_id: dayId, lng, lat, place_id, address };
    await createPlace(newPlace, places, insertBeforeId);
    setCurrentPlace(null);
  }

  async function handleDeletePlace() {
    if (!currentPlace?.id) return;
    await deletePlaces({ placesToDelete: [currentPlace.id], places, dayId });
    setCurrentPlace(null);
  }

  const savedName = places.find((place) => place.id === currentPlace?.id)?.name;

  return (
    <AdvancedMarker
      className=" z-50 mb-8 flex flex-col gap-2 rounded-lg bg-slate-50 p-4 shadow-lg"
      position={currentPlace?.position}
      onClick={(e) => e.stop()}
      ref={advancedMarkerRef}
    >
      {isLoading || !placeDetails ? (
        <div className="animate-spin">
          <LoaderCircle />
        </div>
      ) : (
        <>
          <div>
            <div className="flex justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {savedName ?? placeDetails.displayName.text}
              </h2>
              <button
                className="-translate-y-3 translate-x-2"
                onClick={() => setCurrentPlace(null)}
                aria-label="Close info window"
              >
                <X size={18} />
              </button>
            </div>
            <h3 className=" text-sm text-slate-600">
              {placeDetails.shortFormattedAddress}
            </h3>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex flex-col">
              <span>
                {placeDetails?.primaryTypeDisplayName?.text || "place"}
              </span>
              {placeDetails.rating && (
                <span className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1">
                    {placeDetails.rating}
                    <Star size={14} />
                  </span>
                  ({placeDetails.userRatingCount})
                </span>
              )}
              <OpeningHours
                regularOpeningHours={placeDetails.regularOpeningHours}
                date={date}
              />
            </div>
            <div className="mb-3 flex gap-1 text-slate-500">
              {placeDetails.websiteUri && (
                <>
                  <a
                    href={placeDetails.websiteUri}
                    target="_blank"
                    className="underline"
                  >
                    Website
                  </a>
                  •
                </>
              )}
              <a
                href={placeDetails.googleMapsUri}
                target="_blank"
                className="underline"
              >
                Google Maps
              </a>
            </div>
          </div>
          {!isShared && (
            <>
              {currentPlace?.id ? (
                <form
                  action={handleDeletePlace}
                  className="flex justify-center"
                >
                  <Button
                    className="self-center text-red-900"
                    variant="outline"
                    size="sm"
                    disabled={isShared}
                  >
                    Delete place
                  </Button>
                </form>
              ) : (
                <form action={handleCreatePlace}>
                  <Button className="w-full" disabled={isShared}>
                    Add place
                  </Button>
                </form>
              )}
            </>
          )}
        </>
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
  const setCurrentPlace = useSetAtom(currentPlaceAtom);

  const handleClick = (place: Place) => {
    const { id, position } = place;
    const placeId = place.placeId;
    const currentPlace = { id, placeId, position };
    setCurrentPlace(currentPlace);
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
          <Pin background="#059669" borderColor="#064e3b">
            <span className="text-base font-bold text-slate-100">{i + 1}</span>
          </Pin>
        </AdvancedMarker>
      ))}
    </>
  );
}
