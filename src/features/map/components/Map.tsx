"use client";

import mapboxgl from "mapbox-gl";
import { useCallback, useRef, useState } from "react";
import { Map as MapBox, MapRef, Popup } from "react-map-gl";

export default function Map() {
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
  const mapRef = useRef<MapRef>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [lngLat, setLngLat] = useState(new mapboxgl.LngLat(-122.4, 37.8));
  const [popupInfo, setPopupInfo] = useState({ name: "", category: "" });

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.on("click", (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ["poi-label"],
      });
      if (features && features.length > 0) {
        setLngLat(e.lngLat);

        const feature = features[0];
        setPopupInfo({
          name: feature.properties?.name,
          category: feature.properties?.category_en,
        });
        setShowPopup(true);
        mapRef.current?.panTo(e.lngLat);
      } else setShowPopup(false);
    });
  }, []);

  return (
    <MapBox
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      ref={mapRef}
      onLoad={onMapLoad}
      initialViewState={{
        longitude: -118.11,
        latitude: 34.57,
        zoom: 14,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      {showPopup && (
        <Popup
          longitude={lngLat.lng}
          latitude={lngLat.lat}
          offset={10}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
        >
          <div className="w-fit">
            <h1 className="text-lg">{popupInfo.name}</h1>
            <h2>{popupInfo.category}</h2>
            <button onClick={() => console.log(123)}>Add +</button>
          </div>
        </Popup>
      )}
    </MapBox>
  );
}
