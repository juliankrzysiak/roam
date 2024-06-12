"use client";

import {
  APIProvider,
  AdvancedMarker,
  Map as GoogleMap,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { Day, Place } from "@/types";

type MapProps = {
  day: Day;
};

export default function Map({ day }: MapProps) {
  getLocation();

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <GoogleMap
        className="w-full"
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        mapId={"2b28f32837556830"}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom,
          )
        }
      >
        <Markers places={day.places} />
      </GoogleMap>
    </APIProvider>
  );
}

function getLocation() {
  return navigator.geolocation.getCurrentPosition((position) =>
    console.log(position),
  );
}

function Markers({ places }: { places: Place[] }) {
  return (
    <>
      {places.map((place) => (
        <AdvancedMarker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
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
