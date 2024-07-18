export type Place = {
  id: string;
  placeId: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string;
  placeDuration: number;
  tripDuration: number;
  schedule: {
    arrival: Date;
    departure: Date;
  };
  travel?: {
    distance: number;
    duration: number;
  };
};

export type PlaceNoSchedule = Omit<Place, "schedule">;

export type Day = {
  id: string;
  date: Date;
  timezone: string;
  travel?: Travel;
  places: Place[];
};

export type Travel = {
  distance: number;
  duration: number;
};

export type DateRange = {
  from: Date;
  to?: Date;
};
