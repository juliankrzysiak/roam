import { Place } from "@/types";
import { format, formatISO, parse, parseISO } from "date-fns";
import { DateRange } from "@/types";

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

type Trip = {
  id: string;
  name: string;
  days: { date: string }[];
};

// Calculate the min and max days and replace days with new property
export function mapDateRange(trips: Trip[]) {
  return trips.map((trip) => {
    const dateRange = calcDateRange(trip.days);
    // Remove a property and add a property
    const { days, ...newTrip } = { ...trip, dateRange };

    return newTrip;
  });
}

export function calcDateRange(days: { date: string }[]) {
  const sortedDays = days.map(({ date }) => date).sort();
  const from = parseISO(sortedDays[0]);
  const to = parseISO(sortedDays[days.length - 1]);

  const dateRange: DateRange = {
    from,
  };
  if (to && from !== to) dateRange.to = to;

  return dateRange;
}

/* --------------------------------- Convert -------------------------------- */

export const convertKmToMi = (km: number) => Math.round(km / 1609);
export const convertSecToMi = (sec: number) => Math.round(sec / 60);
