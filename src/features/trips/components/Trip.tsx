import { deleteTrip } from "@/utils/actions";
import Link from "next/link";

interface Props {
  name: string;
  id: number;
}

export default async function Trip({ id, name }: Props) {
  return (
    <article className="flex flex-col gap-4 border bg-slate-100 p-4 shadow-lg">
      <h1 className="text-center text-2xl">{name}</h1>
      <Link href={`/map/${id}`}>Check out trip</Link>
      <form action={deleteTrip}>
        <input type="hidden" name="tripId" value={id} />
        <button>X</button>
      </form>
    </article>
  );
}
