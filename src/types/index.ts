export type Place = {
  id: string;
  placeId: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string | null;
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
  travel: Travel;
  path?: string;
};

export type Travel = {
  distance: number;
  duration: number;
};

export type Trip = {
  tripId: string;
  name: string;
  dateRange: DateRange;
  currentDate: string;
  timezone: string;
};

export type DateRange = {
  from: Date;
  to: Date;
  datesWithPlaces: Date[];
};
