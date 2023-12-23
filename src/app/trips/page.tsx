import Trip from "@/features/trips/components/Trip";
import { createTrip } from "@/utils/actions";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Trips() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: trips, error } = await supabase.from("trips").select();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  if (error) return <div>error</div>;

  return (
    <div className="flex flex-col items-center">
      <h1>Trips</h1>
      {trips.map((trip) => {
        return <Trip key={trip.id} name={trip.name} id={trip.id} />;
      })}
      <form action={createTrip}>
        <h2>Create new trip</h2>
        <input type="text" name="name" />
        <button>Submit</button>
      </form>
    </div>
  );
}
