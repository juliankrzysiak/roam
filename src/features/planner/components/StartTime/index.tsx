import { DayContext } from "@/app/[trip]/DayProvider";
import { useContext } from "react";
import { updateStartTime } from "@/utils/actions/crud/update";

type Props = {
  endTime: string;
};

export default function StartTime({ endTime }: Props) {
  const dayInfo = useContext(DayContext);

  return (
    <div className="flex items-center justify-around">
      <form action={updateStartTime} className="flex flex-col text-center">
        <label className="flex w-fit flex-col">
          Start time
          <input
            type="time"
            name="startTime"
            defaultValue={dayInfo.startTime}
          />
          <input type="hidden" name="id" defaultValue={dayInfo.currentDayId} />
          <button>Submit</button>
        </label>
      </form>
      <div className="flex flex-col text-center">
        <p>End Time</p>
        <p>{endTime}</p>
      </div>
    </div>
  );
}
