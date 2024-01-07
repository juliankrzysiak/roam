export type PlaceT = {
  id: string;
  duration: number;
  name: string;
  category: string;
  lng: number;
  lat: number;
  tripInfo?: TripInfo
};

export type TripInfo = {
  distance: number;
  duration: number;
};
