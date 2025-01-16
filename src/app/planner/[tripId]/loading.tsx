import { Map } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid flex-1 place-items-center">
      <Map className="animate-bounce" size={72} />
    </main>
  );
}
