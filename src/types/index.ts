import mapboxgl from "mapbox-gl";

export interface PlaceT {
  duration: {
    hours: number;
    minutes: number;
  };
  id: number;
  name: string;
  category: string;
  lngLat: mapboxgl.LngLat;
}
