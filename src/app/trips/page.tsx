import NewTripForm from "@/features/trips/components/NewTripForm";
import TripCard from "@/features/trips/components/TripCard";
import { DateRange } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { parseISO } from "date-fns";
import { redirect } from "next/navigation";

type Trip = {
  id: string;
  name: string;
  days: { date: string }[];
};

export default async function Trips() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data, error } = await supabase
    .from("trips")
    .select("id, name, days (date)");
  if (error) throw new Error(`${error.message}`);

  // sort by startDates
  const trips = mapDateRange(data).sort((a, b) => {
    const startDateA = a.dateRange.from;
    const startDateB = b.dateRange.from;

    if (startDateA > startDateB) return 1;
    if (startDateA < startDateB) return -1;
    else return 0;
  });

  return (
    <main className="flex flex-col items-center gap-4 p-6">
      <NewTripForm />
      <section className="grid w-full max-w-xl grid-cols-magic place-content-center gap-4 rounded-md bg-slate-200 p-4 text-center">
        {trips.length < 1 && <p>It`&apos;s a bit empty here...</p>}
        {trips.map((trip) => {
          return <TripCard key={trip.id} {...trip} />;
        })}
      </section>
    </main>
  );
}

// Calculate the min and max days and replace days with new property
function mapDateRange(trips: Trip[]) {
  return trips.map((trip) => {
    const sortedDays = trip.days.map(({ date }) => date).sort();
    const { 0: start, length, [length - 1]: end } = sortedDays;

    const dateRange: DateRange = {
      from: parseISO(start),
    };
    if (start !== end) {
      dateRange.to = parseISO(end);
    }

    // Remove a property and add a property
    const { days, ...newTrip } = { ...trip, dateRange };

    return newTrip;
  });
}
