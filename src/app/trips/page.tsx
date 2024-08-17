import NewTripForm from "@/features/trips/components/NewTripForm";
import TripCard from "@/features/trips/components/TripCard";
import { mapDateRange } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Trips() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data, error } = await supabase
    .from("trips")
    .select(
      "tripId:id, name, days (date, orderPlaces:order_places), currentDate:current_date, timezone",
    )
    .order("date", { referencedTable: "days" });
  if (error) throw new Error(error.message);

  // todo: replace with rpc
  const trips = mapDateRange(data).sort((a, b) => {
    const startDateA = a.dateRange.from;
    const startDateB = b.dateRange.from;

    if (startDateA > startDateB) return 1;
    if (startDateA < startDateB) return -1;
    else return 0;
  });

  return (
    <main className="flex flex-col items-center gap-12 p-6">
      <div className="flex flex-col items-center gap-2">
        <NewTripForm />
        <h2 className="mt-4 text-2xl">Upcoming Trips</h2>
        <section className="grid w-full max-w-xl grid-cols-magic place-content-center gap-4 rounded-md bg-slate-200 p-4 text-center">
          {trips.length < 1 && <p>It`s a bit empty here...</p>}
          {trips.map((trip) => {
            return <TripCard key={trip.tripId} {...trip} />;
          })}
        </section>
      </div>
      <div className="flex flex-col items-center gap-2 ">
        <h2 className="text-2xl">Past Trips</h2>
        <section className="grid w-full max-w-xl grid-cols-magic place-content-center gap-4 rounded-md bg-slate-200 p-4 text-center">
          {trips.length < 1 && <p>It`s a bit empty here...</p>}
          {trips.map((trip) => {
            return <TripCard key={trip.tripId} {...trip} />;
          })}
        </section>
      </div>
    </main>
  );
}
