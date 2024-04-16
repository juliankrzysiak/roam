export type PlaceT = {
  id: string;
  duration: Duration
  name: string;
  category: string;
  lng: number;
  lat: number;
  tripInfo?: Trip;
};

export type Duration = {
  hours: number,
  minutes: number
}

export type Trip = {
  distance: number;
  duration: number;
};

export type Time = {
  arrival: Date;
  departure: Date;
};

export type TripInfo = {
  trip: number;
};

export type DayInfo = {
  orderDays: string[];
  currentDay: string;
  startTime: string;
};
