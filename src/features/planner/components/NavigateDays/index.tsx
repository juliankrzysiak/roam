import { DatePicker } from "@/components/general/DatePicker";
import { createDay } from "@/utils/actions/crud/create";
import { updateDay, updateDayOrder } from "@/utils/actions/crud/update";

type Props = {
  orderDays: string[];
  dayId: string;
  tripId: number;
};

export default function NavigateDays({ orderDays, dayId, tripId }: Props) {
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
      <DatePicker />
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
    const tripId = Number(formData.get("tripId"));
    const id = await createDay(tripId);

    if (!id) throw new Error();
    const newOrder = [...orderDays, id];
    await updateDayOrder(tripId, newOrder);
    // await updateDay(formData);
  }
}
