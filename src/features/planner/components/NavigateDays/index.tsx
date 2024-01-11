import { DayInfo } from "@/types";
import { updateDay } from "@/utils/actions";
import styles from "../styles.module.css";

type Props = {
  dayInfo: DayInfo;
  tripId: number;
};

export default function NavigateDays({
  dayInfo: { orderDays, dayId },
  tripId,
}: Props) {
  const currentIndex = orderDays.findIndex((id) => id === dayId);
  const nextDay = orderDays[currentIndex + 1];
  const previousDay = orderDays[currentIndex - 1];

  return (
    <div className={styles["navigate-days"]}>
      <form action={updateDay}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="dayId" value={previousDay} />
        <button>Previous</button>
      </form>
      <span>Day: {currentIndex + 1}</span>
      <form action={updateDay}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="dayId" value={nextDay} />
        <button>Next</button>
      </form>
    </div>
  );
}
