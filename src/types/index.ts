import mapboxgl from "mapbox-gl";

export interface PlaceT {
  id?: number;
  duration: number;
  name: string;
  category: string;
  lng: number;
  lat: number;
}
