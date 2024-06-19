export type Place = {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  placeDuration: number;
  tripDuration: number;
  placeId: string | null;
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
