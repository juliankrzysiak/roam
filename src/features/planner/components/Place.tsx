import { useState } from "react";
import { add, addMinutes } from "date-fns";

export default function Place({ name, arrival, departure }: any) {
  const [duration, setDuration] = useState("00:00");
  return (
    <div className="my-4 flex ">
      <div>
        <div>Arrival {arrival}</div>
        <label className="flex">
          Duration
          <input
            type="number"
            value={duration}
            step={5}
            onChange={(event) => setDuration(event.target.value)}
          />
        </label>
        <div>Departure {departure}</div>
      </div>
      <h1>{name}</h1>
    </div>
  );
}
