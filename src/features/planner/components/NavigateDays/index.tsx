import { DatePicker } from "@/components/general/DatePicker";
import { DayInfo } from "@/types";
import { createDay } from "@/utils/actions/crud/create";
import {
  updateDate,
  updateDay,
  updateDayOrder,
  updateStartTime,
} from "@/utils/actions/crud/update";
import { parse } from "date-fns";

import { add } from "date-fns";

type Props = {
  dayInfo: DayInfo;
  tripId: number;
};

export default function NavigateDays({ dayInfo, tripId }: Props) {
  const { orderDays, currentDay: dayId, date } = dayInfo;
  const currentIndex = orderDays.findIndex((id) => id === dayId);
  const previousDayId = orderDays[currentIndex - 1];
  const nextDayId = orderDays[currentIndex + 1];

  return (
    <div className="flex flex-col items-center">
      <p>Day {currentIndex + 1}</p>
      <div className="top sticky flex items-center justify-between gap-2 ">
        <form action={updateDay}>
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="dayId" value={previousDayId} />
          <button className={`${!previousDayId && "invisible"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </form>
        <DatePicker
          initialDate={parse(date, "yyyy-MM-dd", new Date())}
          dayId={dayId}
        />

        {nextDayId ? (
          <form action={updateDay}>
            <input type="hidden" name="tripId" value={tripId} />
            <input type="hidden" name="dayId" value={nextDayId} />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </form>
        ) : (
          <form action={addDay}>
            <input type="hidden" name="tripId" value={tripId} />
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );

  async function addDay(formData: FormData) {
    const tripId = Number(formData.get("tripId"));
    const id = await createDay(tripId, date);

    if (!id) throw new Error();
    const newOrder = [...orderDays, id];
    await updateDayOrder(tripId, newOrder);
    // await updateDay(formData);
  }
}
