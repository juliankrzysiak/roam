import { Trip } from "@/types";
import TripCard from "./TripCard";

type Props = {
  trips: Trip[];
  title: string;
  defaultMessage?: string;
  children?: React.ReactNode;
};

export default function TripSection({
  trips,
  title,
  defaultMessage = "It's a bit empty here...",
  children,
}: Props) {
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-2 ">
      {children}
      <h2 className="text-2xl">{title}</h2>
      <section className="grid place-content-center gap-4 rounded-md bg-slate-200 p-4 ">
        {trips.length < 1 && <p>{defaultMessage}</p>}
        {trips.map((trip) => {
          return <TripCard key={trip.tripId} {...trip} />;
        })}
      </section>
    </div>
  );
}
