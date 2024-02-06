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
      <h1 className="text-4xl underline">Trips</h1>
      <TripForm />
      <div className="grid grid-flow-col gap-4">
        {trips.map((trip) => {
          return <Trip key={trip.id} name={trip.name} id={trip.id} />;
        })}
      </div>
    </div>
  );
}
