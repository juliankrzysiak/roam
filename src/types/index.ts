export type Place = {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  placeDuration: number;
  tripDuration: number;
  placeId: string;
  arrival: Date;
  departure: Date;
  travel?: {
    distance: number;
    duration: number;
  };
};

export type PlaceNoSchedule = Omit<Place, "arrival" | "departure">;

export type Day = {
  id: string;
  date: Date;
  startTime: string;
  places: Place[];
};

export type Travel = {
  distance: number;
  duration: number;
};
