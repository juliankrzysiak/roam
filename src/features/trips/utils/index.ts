import { eachDayOfInterval, format, isEqual } from "date-fns";
import { DateRange } from "@/types";

export function getEachDateInRange(start: Date, end?: Date): Date[] {
  if (!end) return [start];
  else return eachDayOfInterval({ start, end });
}

export function getAlertStrings(
  datesWithPlaces: Date[],
  datesForRemoval: Date[],
  pattern = "MMM dd",
) {
  return datesWithPlaces
    .filter((dateWithPlace) =>
      datesForRemoval.some((dateForRemoval) =>
        isEqual(dateForRemoval, dateWithPlace),
      ),
    )
    .map((date) => format(date, pattern));
}

export function getIsSameDateRange(
  initialDateRange: DateRange,
  newDateRange: DateRange,
) {
  return (
    isEqual(initialDateRange.from, newDateRange.from) &&
    isEqual(initialDateRange.to, newDateRange.to)
  );
}
