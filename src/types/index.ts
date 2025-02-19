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
  isManual: boolean;
};

export type TotalTravel = Omit<Travel, "routingProfile" | "isManual">;

type RoutingProfile = "driving" | "walking" | "cycling";

export type RawPlaceData = Omit<Place, "schedule" | "travel"> & {
  placeDuration: number;
  routingProfile: RoutingProfile;
  isManual: boolean;
  travelDuration: number | null;
  travelDistance: number | null;
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

export type TripData = {
  tripId: string;
  name: string;
  days: {
    date: string;
    orderPlaces: string[];
    totalDistance: number;
    totalDuration: number;
  }[];
  currentDate: string;
  timezone: string;
  isSharing: boolean;
  sharingId: string | null;
};

export type Trip = {
  tripId: string;
  name: string;
  days: {
    date: Date;
    orderPlaces: string[];
    totals: { distance: number; duration: number };
  }[];
  currentDate: string;
  dateRange: DateRange;
  timezone: string;
  sharing: {
    isSharing: boolean;
    sharingId: string | null;
  };
};

export type TripLite = Pick<
  TripData,
  "tripId" | "name" | "isSharing" | "timezone"
> & { dateRange: Trip["dateRange"] } & { days: { date: string }[] };

export type DateRange = {
  from: Date;
  to: Date;
};
