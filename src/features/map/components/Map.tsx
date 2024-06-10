"use client";

import { usePopupStore } from "@/lib/store";
import { Day, Place } from "@/types";
import { parseOrder } from "@/utils";
import { createPlace } from "@/utils/actions/crud/create";
import { deletePlace } from "@/utils/actions/crud/delete";
import { updatePlaceOrder } from "@/utils/actions/crud/update";

import mapboxgl from "mapbox-gl";
import { useRef } from "react";
import { Map as MapBox, MapRef, Marker, Popup } from "react-map-gl";
import { v4 as uuidv4 } from "uuid";

type MapProps = {
  day: Day;
};

export default function Map({ day }: MapProps) {
  const mapRef = useRef<MapRef>(null);
  const popup = usePopupStore((state) => state.popup);
  const updatePopup = usePopupStore((state) => state.updatePopup);

  const { places } = day;
  const isMarker = places.some((place) => place.id === popup?.id);

  if (popup) mapRef.current?.panTo([popup.lng, popup.lat]);

  function handleClickMap(e: mapboxgl.MapMouseEvent) {
    if (!mapRef.current) return;
    const features = mapRef.current?.queryRenderedFeatures(e.point, {
      layers: ["poi-label"],
    });
    if (features.length > 0) {
      const feature = features[0];
      updatePopup({
        id: uuidv4(),
        name: feature.properties?.name,
        category: feature.properties?.category_en,
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      });
    } else updatePopup(null);
  }

  async function handleAddPlace() {
    if (!popup) return;
    const order = parseOrder(places);
    const newOrder = [...order, popup.id];
    await createPlace(popup, day.id);
    await updatePlaceOrder(newOrder, day.id);
    updatePopup(null);
  }

  async function handleDeletePlace() {
    if (!popup) return;
    const order = parseOrder(places);
    const newOrder = order.filter((id) => id !== popup.id);
    await deletePlace(popup.id);
    await updatePlaceOrder(newOrder, day.id);
    updatePopup(null);
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
      {places.map((place, i) => {
        return (
          <Marker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            onClick={(e) => {
              updatePopup(place);
              e.originalEvent.stopPropagation();
            }}
          >
            <div className="grid aspect-square w-10 place-content-center rounded-lg bg-lime-800 text-xl text-slate-50">
              {i + 1}
            </div>
          </Marker>
        );
      })}

      {popup && (
        <Popup
          longitude={popup.lng}
          latitude={popup.lat}
          offset={10}
          closeOnClick={false}
          onClose={() => updatePopup(null)}
        >
          <div className="w-fit">
            <h1 className="text-lg">{popup.name}</h1>
            <h2>{popup.category}</h2>
            {!isMarker && <button onClick={handleAddPlace}>Add +</button>}
            {isMarker && <button onClick={handleDeletePlace}>Delete -</button>}
          </div>
        </Popup>
      )}
    </MapBox>
  );
}
