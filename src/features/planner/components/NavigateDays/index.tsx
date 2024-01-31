import { DayInfo } from "@/types";
import { updateDay, createDay, updateDayOrder } from "@/utils/actions";
import { add } from "date-fns";

type Props = {
  dayInfo: DayInfo;
  tripId: number;
};

export default function NavigateDays({
  dayInfo: { orderDays, dayId },
  tripId,
}: Props) {
  const currentIndex = orderDays.findIndex((id) => id === dayId);
  const previousDayId = orderDays[currentIndex - 1];
  const nextDayId = orderDays[currentIndex + 1];

  return (
    <div className="sticky top-0 flex justify-between bg-inherit">
      <form action={updateDay}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="dayId" value={previousDayId} />
        <button>Previous</button>
      </form>
      <span>Day {currentIndex + 1}</span>
      {nextDayId ? (
        <form action={updateDay}>
          <input type="hidden" name="tripId" value={tripId} />
          <input type="hidden" name="dayId" value={nextDayId} />
          <button>Next</button>
        </form>
      ) : (
        <form action={addDay}>
          <input type="hidden" name="tripId" value={tripId} />
          <button>Add +</button>
        </form>
      )}
    </div>
  );

  async function addDay(formData: FormData) {
    const { id } = (await createDay(formData)) || {};
    formData.set("dayId", id);
    const newOrder = [...orderDays, id];
    await updateDayOrder(formData, newOrder);
    await updateDay(formData);
  }
}
