import Trip from "@/features/trips/components/Trip";
import { createTrip } from "@/utils/actions";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Trips() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: trips, error } = await supabase
    .from("trips")
    .select("id, name");
  if (error) return <div>error</div>;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl">Trips</h1>
      <div className="grid grid-flow-col gap-4">
        {trips.map((trip) => {
          return <Trip key={trip.id} name={trip.name} id={trip.id} />;
        })}
      </div>
      <form action={createTrip}>
        <h2>Create new trip</h2>
        <input type="text" name="name" />
        <button>Submit</button>
      </form>
    </div>
  );
}
