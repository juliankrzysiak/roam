export type Place = {
  id: string;
  placeId: string;
  name: string;
  position: google.maps.LatLngLiteral;
  address: string | null;
  notes: string;
  schedule: {
    arrival: Date;
    duration: number;
    departure: Date;
  };
  travel?: Travel;
};

export type Travel = {
  distance: number;
  duration: number;
  routingProfile: RoutingProfile;
};

export type TotalTravel = Omit<Travel, "routingProfile">;

type RoutingProfile = "driving" | "walking" | "cycling";

export type RawPlaceData = Omit<Place, "schedule" | "travel"> & {
  placeDuration: number;
  routingProfile: RoutingProfile;
};
export type PlaceNoSchedule = Omit<Place, "schedule"> & {
  placeDuration: number;
};

export type Day = {
  id: string;
  date: Date;
  timezone: string;
  places: Place[];
  travel: TotalTravel;
  path?: string;
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
