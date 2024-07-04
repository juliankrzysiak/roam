export type Place = {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  placeDuration: number;
  tripDuration: number;
  placeId: string;
  arrival: Date;
  departure: Date
};

export type PlaceNoSchedule = Omit<Place, 'arrival' | 'departure'>

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
