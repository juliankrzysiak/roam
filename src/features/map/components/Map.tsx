"use client";

import { useCallback, useRef, useState } from "react";
import { Map as MapBox, MapLayerMouseEvent, MapRef, Popup } from "react-map-gl";

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
  const [lngLat, setLngLat] = useState({ lng: -122.4, lat: 37.8 });
  const [name, setName] = useState("");

  function handlePopup(e: MapLayerMouseEvent) {
    const { lng, lat } = e.lngLat;
    setLngLat({ lng, lat });
    setShowPopup(true);
  }

  const onMapLoad = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.on("click", (e) => {
      const features = mapRef.current?.queryRenderedFeatures(e.point, {
        layers: ["poi-label"],
      });
      if (features && features.length > 0) {
        const feature = features[0];
        setName(feature.properties?.name);
      } else setShowPopup(false);
    });
  }, []);

  return (
    <MapBox
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      ref={mapRef}
      onLoad={onMapLoad}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onClick={handlePopup}
    >
      {showPopup && (
        <Popup
          longitude={lngLat.lng}
          latitude={lngLat.lat}
          closeOnClick={false}
          onClose={() => setShowPopup(false)}
        >
          <h1>{name}</h1>
        </Popup>
      )}
    </MapBox>
  );
}
