import Trip from "@/features/trips/components/Trip";
import TripForm from "@/features/trips/components/TripForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Trips() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: trips, error } = await supabase.from("trips").select();
  if (!trips || error) throw new Error(`${error.message}`);

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-2 text-4xl underline">Trips</h1>
      <TripForm />
      <section className="m-4 grid  w-full  grid-cols-magic gap-4 rounded-sm bg-slate-400 p-4">
        {trips.map((trip) => {
          return <Trip key={trip.id} name={trip.name} id={trip.id} />;
        })}
      </section>
    </div>
  );
}
