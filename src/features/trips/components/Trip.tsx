import { deleteTrip } from "@/utils/actions";
import Link from "next/link";

interface Props {
  name: string;
  id: number;
  day: number;
}

export default async function Trip({ id, name, day }: Props) {
  return (
    <article className="flex flex-col border ">
      <h1>{name}</h1>
      <Link href={`/map/${id}`}>Check out trip</Link>
      <form action={deleteTrip}>
        <input type="hidden" name="tripId" value={id} />
        <button>delete trip</button>
      </form>
    </article>
  );
}
