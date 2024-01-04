"use client";

import { PlaceT } from "@/types";
import { updateOrder, updateStartTime } from "@/utils/actions";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { add, format, parse } from "date-fns";
import Place from "./Place";
import { startTransition, useEffect, useOptimistic, useState } from "react";
import { Reorder } from "framer-motion";

type Props = {
  places: PlaceT[];
  order: string[];
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

export default function Planner({ places, order }: Props) {
  const orderedPlaces = places.sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );
  useEffect(() => {
    setItems(orderedPlaces);
  }, [orderedPlaces]);

  const [items, setItems] = useState(places);
  const [optimisticOrder, updateOptimisticOrder] = useOptimistic(
    order,
    (_state: string[], newOrder: string[]) => newOrder,
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = order.indexOf(active.id as string);
      const newIndex = order.indexOf(over.id as string);
      const newOrder = arrayMove(order, oldIndex, newIndex);

      startTransition(() => {
        updateOptimisticOrder(newOrder);
        updateOrder(newOrder);
      });
    }
  }

  let startTime = parse("08:00", "HH:mm", new Date());
  let endTime;

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
    var oldOrder = order;
    var newOrder = items.map(function getId(place) {
      return place.id;
    });
    if (newOrder.join("") === oldOrder.join("")) return;
    updateOrder(newOrder);
  }
}
