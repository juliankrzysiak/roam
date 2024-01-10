"use client";

import { DayInfo, PlaceT } from "@/types";
import { parseOrder } from "@/utils";
import {
  createDay,
  updateDayOrder,
  updatePlaceOrder,
  updateStartTime,
} from "@/utils/actions";
import { add, format, parse } from "date-fns";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import Card from "./Card";
import { useRouter } from "next/navigation";
import NavigateDays from "./NavigateDays";

type Props = {
  places: PlaceT[];
  dayInfo: DayInfo;
  tripId: number;
};

export default function Planner({ places, dayInfo, tripId }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(places);
  const { orderDays, dayId } = dayInfo;
  let startTime = parse(dayInfo.startTime, "HH:mm", new Date());
  let endTime;

  useEffect(() => {
    setItems(places);
  }, [places]);

  return (
    <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
      <form action={updateStartTime}>
        <label className="flex w-fit flex-col">
          Start time
          <input
            type="time"
            name="startTime"
            defaultValue={format(startTime, "HH:mm")}
          />
          <button>Submit</button>
        </label>
      </form>
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((place, i, arr) => {
          const arrival = startTime;
          const departure = add(arrival, { minutes: place.duration });

          const time = { arrival, departure };

          startTime = add(departure, {
            minutes: place.tripInfo?.duration ?? 0,
          });
          if (i === arr.length - 1) endTime = format(departure, "HH:mm");
          return (
            <Card
              key={place.id}
              place={place}
              time={time}
              handleDragEnd={reorderPlaces}
            />
          );
        })}
      </Reorder.Group>
      <span className="flex w-fit flex-col">End Time {endTime ?? 0}</span>
      <NavigateDays orderDays={orderDays} dayId={dayId} />
      {/* <form action={addDay}>
        <input type="hidden" name="trip" value={params.trip} />
        <button>Add Day</button>
      </form> */}
    </section>
  );

  // async function addDay(formData: FormData) {
  //   const { id } = (await createDay(formData)) || {};
  //   const newOrder = [...orderDays, id];
  //   await updateDayOrder(formData, newOrder);
  //   router.push(`${id}`);
  // }

  function reorderPlaces() {
    const oldOrder = parseOrder(places);
    const newOrder = parseOrder(items);

    function checkEqualArrays(arr1: string[], arr2: string[]) {
      return arr1.join("") === arr2.join("");
    }
    // Don't want to invoke a server action when dragging and dropping to the same position
    if (checkEqualArrays(oldOrder, newOrder)) return;
    updatePlaceOrder(newOrder, dayId);
  }
}
