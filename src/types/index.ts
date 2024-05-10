export type PlaceT = {
  id: string;
  name: string;
  category: string;
  lng: number;
  lat: number;
  placeDuration: number;
  tripDuration: number;
  tripInfo?: Trip;
};

export type PlaceInfo = PlaceT & {
  arrival: Date;
  departure: Date;
  placeDuration: number;
};

export type Duration = {
  hours: number;
  minutes: number;
};

export type Trip = {
  distance: number;
  duration: number;
};

export type Time = {
  arrival: Date;
  departure: Date;
};

export type TripInfo = {
  trip: number;
};

export type DayInfo = {
  orderDays: string[];
  currentDay: string;
  startTime: string;
  date: string;
};
