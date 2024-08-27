import { Map } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Map className="animate-bounce text-emerald-900" size={72} />
    </main>
  );
}
