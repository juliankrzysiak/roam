import mapboxgl from "mapbox-gl";

export interface PlaceT {
  duration: number;
  id: number;
  name: string;
  category: string;
  lngLat: mapboxgl.LngLat;
}
