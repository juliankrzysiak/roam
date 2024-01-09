"use client";

import { PlaceT } from "@/types";
import { parseOrder } from "@/utils";
import { createPlace, deletePlace, updatePlaceOrder } from "@/utils/actions";
import mapboxgl from "mapbox-gl";
import { useRef, useState } from "react";
import { Map as MapBox, MapRef, Marker, Popup } from "react-map-gl";
import { v4 as uuidv4 } from "uuid";

type Props = {
  places: PlaceT[];
  params: {
    trip: number;
    day: number;
  };
};

export default function Map({ places, params }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [popupInfo, setPopupInfo] = useState<PlaceT | null>();

  function handleClickMap(e: mapboxgl.MapMouseEvent) {
    if (!mapRef.current) return;
    const features = mapRef.current?.queryRenderedFeatures(e.point, {
      layers: ["poi-label"],
    });
    if (features && features.length > 0) {
      const feature = features[0];
      setPopupInfo({
        id: uuidv4(),
        name: feature.properties?.name,
        category: feature.properties?.category_en,
        duration: 0,
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      });
      mapRef.current?.panTo(e.lngLat);
    } else setPopupInfo(null);
  }

  async function handleAddPlace() {
    if (!popupInfo) return;
    const order = parseOrder(places);
    const newOrder = [...order, popupInfo.id];
    // TODO: add updating order inside creation
    await createPlace({ ...popupInfo, day_id: params.day });
    await updatePlaceOrder(newOrder, params.day);
    setPopupInfo(null);
  }

  async function handleDeletePlace() {
    if (!popupInfo) return;
    const order = parseOrder(places);
    const newOrder = order.filter((id) => id !== popupInfo.id);
    await deletePlace(popupInfo.id);
    await updatePlaceOrder(newOrder, params.day);
    setPopupInfo(null);
  }

  return (
    <MapBox
      reuseMaps
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      ref={mapRef}
      onClick={handleClickMap}
      initialViewState={{
        longitude: -118.11,
        latitude: 34.57,
        zoom: 14,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {places.map((place) => {
        return (
          <Marker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            onClick={(e) => {
              setPopupInfo(place);
              mapRef.current?.panTo([place.lng, place.lat]);
              e.originalEvent.stopPropagation();
            }}
          />
        );
      })}

      {popupInfo && (
        <Popup
          longitude={popupInfo.lng}
          latitude={popupInfo.lat}
          offset={10}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
        >
          <div className="w-fit">
            <h1 className="text-lg">{popupInfo.name}</h1>
            <h2>{popupInfo.category}</h2>
            <button onClick={handleAddPlace}>Add +</button>
            <button onClick={handleDeletePlace}>Delete -</button>
          </div>
        </Popup>
      )}
    </MapBox>
  );
}
