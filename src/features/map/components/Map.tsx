"use client";

import {
  APIProvider,
  Map as GoogleMap,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";

import { Day } from "@/types";

type MapProps = {
  day: Day;
};

export default function Map({ day }: MapProps) {
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
      ></GoogleMap>
    </APIProvider>
  );
}
