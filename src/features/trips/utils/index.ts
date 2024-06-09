import { eachDayOfInterval } from "date-fns";

export function getEachDateInRange(start: Date, end?: Date): Date[] {
  if (!end) return [start];
  else return eachDayOfInterval({ start, end });
}
