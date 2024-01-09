export type PlaceT = {
  id: string;
  duration: number;
  name: string;
  category: string;
  lng: number;
  lat: number;
  tripInfo?: Trip;
};

export type Trip = {
  distance: number;
  duration: number;
};

export type Time = {
  arrival: Date;
  departure: Date;
};
