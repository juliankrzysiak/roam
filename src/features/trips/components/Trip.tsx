import Link from "next/link";

interface Props {
  name: string;
  id: number;
}

export default function Trip({ name, id }: Props) {
  return (
    <article>
      <h1>{name}</h1>
      <Link href={`/map/${id}`}>Check out trip</Link>
    </article>
  );
}
