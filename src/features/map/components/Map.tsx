"use client";

import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const [lng, setLng] = useState(-118);
  const [lat, setLat] = useState(34);
  const [zoom, setZoom] = useState(7);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      if (!map.current) return;
      setLng(Number(map.current.getCenter().lng.toFixed(4)));
      setLat(Number(map.current.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current.getZoom().toFixed(2)));
    });
  });

  return <div className="h-full" ref={mapContainer}></div>;
}
