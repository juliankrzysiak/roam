import { deleteTrip } from "@/utils/actions";
import Link from "next/link";

interface Props {
  name: string;
  id: number;
}

export default async function Trip({ name, id }: Props) {
  const deleteTripWithId = deleteTrip.bind(null, id);

  return (
    <article className="flex flex-col border ">
      <h1>{name}</h1>
      <Link href={`/map/${id}`}>Check out trip</Link>
      <form action={deleteTripWithId}>
        <button>delete trip</button>
      </form>
    </article>
  );
}
