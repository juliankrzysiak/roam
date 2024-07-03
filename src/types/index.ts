export type Place = {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  placeDuration: number;
  tripDuration: number;
  placeId: string;
};

type PlaceSchedule = Place & {
  arrival: Date;
  departure: Date;
};

export type Popup = Omit<Place, "placeDuration" | "tripDuration">;

export type PlaceInfo = Place & {
  arrival: Date;
  departure: Date;
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
  places: PlaceSchedule[];
};
