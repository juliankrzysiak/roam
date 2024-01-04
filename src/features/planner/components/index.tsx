"use client";

import { PlaceT } from "@/types";
import { updateOrder, updateStartTime } from "@/utils/actions";
import { add, format, parse } from "date-fns";
import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import Place from "./Place";
import { parseOrder } from "@/utils";

type Props = {
  places: PlaceT[];
  start: string;
};

// async function getRoute(places: PlaceT[]) {
// const coordinates = places
// .map((place) => `${place.lngLat.lng},${place.lngLat.lat}`)
// .join(";");
//
// const profile = "mapbox/driving";
// const res = await fetch(
// `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?annotations=distance,duration&overview=full&access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`,
// );
// return res.json();
// }

export default function Planner({ places, start }: Props) {
  const [items, setItems] = useState(places);
  let startTime = parse(start, "HH:mm", new Date());
  let endTime;

  useEffect(() => {
    setItems(places);
  }, [places]);

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}>
      <section className="absolute inset-4 left-10 top-1/2 h-5/6 w-4/12  -translate-y-1/2 rounded-xl border-4 border-emerald-600 bg-gray-100 shadow-lg ">
        <div className="h-20 border-4 border-b"></div>
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
        {items.map((place, i, arr) => {
          const arrival = startTime;
          const departure = add(arrival, { minutes: place.duration });
          startTime = departure;
          if (i === arr.length - 1) endTime = format(departure, "HH:mm");
          return (
            <Place
              key={place.id}
              place={place}
              arrival={arrival}
              departure={departure}
              handleDragEnd={reOrderPlaces}
            />
          );
        })}
        <span className="flex w-fit flex-col">End Time {endTime ?? 0}</span>
      </section>
    </Reorder.Group>
  );

  function reOrderPlaces() {
    const oldOrder = parseOrder(places);
    const newOrder = parseOrder(items);

    function checkEqualArrays(arr1: string[], arr2: string[]) {
      return arr1.join("") === arr2.join("");
    }
    // Don't want to invoke a server action when dragging and dropping to the same position
    if (checkEqualArrays(oldOrder, newOrder)) return;
    updateOrder(newOrder);
  }
}
