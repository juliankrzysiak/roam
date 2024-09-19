export type Place = {
  id: string;
  placeId: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string | null;
  placeDuration: number;
  notes: string;
  routingProfile: "driving" | "walking" | "cycling";
  schedule: {
    arrival: Date;
    departure: Date;
  };
  userTravel: {
    distance: number | null;
    duration: number | null;
  };
  computedTravel?: {
    distance: number;
    duration: number;
  };
};

export type PlaceNoComputedTravel = Omit<Place, "schedule" | "computedTravel">;
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
  sharing: boolean;
  sharingId: string | null;
};

export type DateRange = {
  from: Date;
  to: Date;
  datesWithPlaces: Date[];
};
