export type Place = {
  id: string;
  placeId: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string;
  placeDuration: number;
  notes: string;
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
  places: Place[];
  path?: string;
  travel?: Travel;
};

export type Travel = {
  distance: number;
  duration: number;
};

export type DateRange = {
  from: Date;
  to?: Date;
};
