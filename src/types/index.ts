import mapboxgl from "mapbox-gl";

export interface PlaceT {
  name: string;
  category: string;
  lngLat: mapboxgl.LngLat;
}
