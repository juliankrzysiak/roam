import { PlaceT } from "@/types";

export default function Place({ name, category }: PlaceT) {
  return (
    <div key={name}>
      <h1>{name}</h1>
      <h2>{category}</h2>
    </div>
  );
}
