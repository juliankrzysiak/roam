export type Place = {
  id: string;
  name: string;
  category: string;
  lng: number;
  lat: number;
  placeDuration: number;
  tripDuration: number;
};

export type Popup = Omit<Place, "placeDuration" | "tripDuration">;

export type PlaceInfo = Place & {
  arrival: Date;
  departure: Date;
  placeDuration: number;
};

// for auto calculated info
export type Trip = {
  distance: number;
  duration: number;
};

export type DayInfo = {
  orderDays: string[];
  indexCurrentDay: number;
  currentDayId: string;
  startTime: string;
  date: string;
};
