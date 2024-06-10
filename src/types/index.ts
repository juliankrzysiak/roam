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

export type Day = {
  id: string;
  date: Date;
  startTime: string;
  places: Place[];
};
