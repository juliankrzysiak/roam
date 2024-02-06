import { Button } from "@/components/ui/button";
import { Trip } from "@/types/supabase";
import { deleteTrip } from "@/utils/actions";
import Link from "next/link";

type Props = Pick<Trip, "id" | "name">;

export default async function Trip({ id, name }: Props) {
  return (
    <article className="flex flex-col items-center gap-4 rounded-lg border bg-slate-100 p-4 shadow-lg">
      <h1 className="text-center text-2xl font-bold">{name}</h1>
      <p>Date</p>
      <p>Miles</p>
      <Link href={`/map/${id}`}>
        <Button>Schedule</Button>
      </Link>
      {/* <form action={deleteTrip}>
        <input type="hidden" name="tripId" value={id} />
        <button>Delete</button>
      </form> */}
    </article>
  );
}
