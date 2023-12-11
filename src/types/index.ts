import mapboxgl from "mapbox-gl";

export interface PlaceT {
  id: number;
  name: string;
  category: string;
  lngLat: mapboxgl.LngLat;
}
