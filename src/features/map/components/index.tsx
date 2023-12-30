"use client";

import { PlaceT } from "@/types";
import { createPlace, deletePlace } from "@/utils/actions";
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
  order: string[];
};

export default function Map({ places, params, order }: Props) {
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
    await createPlace({ ...popupInfo, day_id: params.day });
    setPopupInfo(null);
  }

  async function handleDeletePlace() {
    if (!popupInfo) return;
    await deletePlace(popupInfo.id);
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

// const mapContainer = useRef<HTMLDivElement>(null);
// const map = useRef<MapType | null>(null);
// const popupRef = useRef(new mapboxgl.Popup({ offset: 15 }));
// const [lng, setLng] = useState(-118);
// const [lat, setLat] = useState(34);
// const [zoom, setZoom] = useState(12);
//
// useEffect(() => {
// if (map.current) return; // initialize map only once
// const map = new mapboxgl.Map({
// container: mapContainer.current as HTMLElement,
// style: "mapbox://styles/mapbox/outdoors-v12",
// center: [lng, lat],
// zoom: zoom,
// });
//
// map.current.on("move", () => {
//   if (!map.current) return;
//   setLng(Number(map.current.getCenter().lng.toFixed(4)));
//   setLat(Number(map.current.getCenter().lat.toFixed(4)));
//   setZoom(Number(map.current.getZoom().toFixed(2)));
// });
//
// map.on("click", (e) => {
// const features = map.queryRenderedFeatures(e.point, {
// layers: ["poi-label"],
// });
// if (features.length > 0) {
// const feature = features[0];
// const popupNode = document.createElement("div");
// const popupRoot = createRoot(popupNode);
// popupRoot.render(<Popup name={feature.properties} />);
//
// popupRef.current
// .setLngLat(e.lngLat)
// .setDOMContent(popupNode)
// .addTo(map);
// }
// });
// }, []);
