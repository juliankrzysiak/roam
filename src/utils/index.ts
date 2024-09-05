import { DateRange, Place, Trip } from "@/types";
import { format, formatISO, parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export function mapId(places: Place[]) {
  return places.map((place) => place.id);
}

export function checkSameArr(arr1: string[], arr2: string[]) {
  return arr1.join("") === arr2.join("");
}

type Args = { hours?: number; minutes: number };
// Converts to hours and minutes if only minutes given
// Converts to minutes if hours and minutes given
export function convertTime({ hours, minutes }: Args) {
  return {
    hours: Math.floor(minutes / 60),
    minutes: hours ? hours * 60 + minutes : minutes % 60,
  };
}

export function formatTravelTime({ hours, minutes }: Args) {
  const formattedHours = hours ? hours + " hr" : "";
  return `${formattedHours} ${minutes} min`;
}

export function formatPlaceDuration({ hours, minutes }: Args) {
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return hours + ":" + formattedMinutes;
}

export function parseDate(date: string, format: string = "yyyy-MM-dd") {
  return parse(date, format, new Date());
}

export function sliceDate(date: Date, end: number = 10) {
  return formatISO(date).slice(0, end);
}

// Get what dates to add and remove comparing two arrays of dates]\

export function calcDateDeltas(oldArr: Date[], newArr: Date[]) {
  const removedItems = calcDateDelta(oldArr, newArr);
  const addedItems = calcDateDelta(newArr, oldArr);

  return [addedItems, removedItems];
}

function calcDateDelta(arr1: Date[], arr2: Date[]) {
  return arr1.filter(
    (date1) =>
      !arr2.some((date2) => date2.toUTCString() === date1.toUTCString()),
  );
}

export function formatBulkDates(trip_id: string, dates: Date[]) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return dates.map((date) => ({
    trip_id,
    date: format(date, "yyyy-MM-dd"),
    timezone,
  }));
}

/* -------------------------------- dateRange ------------------------------- */
type TripNoDateRange = Omit<Trip, "dateRange"> & {
  days: { date: string; orderPlaces: string[] }[];
};

export function mapDateRange(trips: TripNoDateRange[]): Trip[] {
  return trips.map((trip) => {
    const dateRange = calcDateRange(trip.days, trip.timezone);
    // Remove a property and add a property
    const { days, ...newTrip } = { ...trip, dateRange };
    return newTrip;
  });
}

type calcDateRangesParam = { date: string; orderPlaces: string[] }[];

export function calcDateRange(dates: calcDateRangesParam, timezone: string) {
  const from = fromZonedTime(dates[0].date, timezone);
  const to = fromZonedTime(dates[dates.length - 1].date, timezone);
  const datesWithPlaces = dates.flatMap((date) =>
    date.orderPlaces.length ? fromZonedTime(date.date, timezone) : [],
  );

  const dateRange: DateRange = {
    from,
    to,
    datesWithPlaces,
  };

  return dateRange;
}

/* --------------------------------- Convert -------------------------------- */

export const convertKmToMi = (km: number) => Math.round(km / 1609);
export const convertSecToMi = (sec: number) => Math.round(sec / 60);
