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
    <div className="flex w-full max-w-2xl flex-col items-center gap-2 ">
      {children}
      <h2 className="text-2xl font-light">{title}</h2>
      <section className="grid w-full grid-cols-magic gap-4 rounded-md bg-slate-300 p-4 text-center">
        {trips.length < 1 && <p className="text-slate-600">{defaultMessage}</p>}
        {trips.map((trip) => {
          return <TripCard key={trip.tripId} {...trip} />;
        })}
      </section>
    </div>
  );
}
