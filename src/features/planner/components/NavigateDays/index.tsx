import { DatePicker } from "@/components/general/DatePicker";
import { Day } from "@/types";
import { parseDate } from "@/utils";
import { createDay } from "@/utils/actions/crud/create";
import { updateDay, updateDayOrder } from "@/utils/actions/crud/update";

type Props = {
  dayInfo: Day;
  tripId: number;
};

export default function NavigateDays({ dayInfo, tripId }: Props) {
  const { orderDays, indexCurrentDay, currentDayId, date } = dayInfo;
  const indexPrevious = indexCurrentDay - 1;
  const indexNext = indexCurrentDay + 1;

  async function addDay(formData: FormData) {
    const tripId = Number(formData.get("tripId"));
    const id = await createDay(tripId, date);

    if (!id) throw new Error();
    const newOrder = [...orderDays, id];
    // Bruh why are the parameters out of order
    await updateDayOrder(tripId, newOrder);
    await updateDay(indexNext, tripId);
  }

  return (
    <div className="flex flex-col items-center">
      <p>Day {indexCurrentDay + 1}</p>
      <div className="top sticky flex w-full items-center justify-between gap-2 ">
        <form
          action={async () => {
            await updateDay(indexPrevious, tripId);
          }}
        >
          <button className={`${indexCurrentDay <= 0 && "invisible"}`}>
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
          initialDate={parseDate(dayInfo.date)}
          dayId={currentDayId}
        />

        {orderDays[indexNext] ? (
          <form
            action={async () => {
              await updateDay(indexNext, tripId);
            }}
          >
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
}
