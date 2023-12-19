import Map from "@/features/map/components/Map";
import Planner from "@/features/planner/components";

export default function MapPage() {
  return (
    <main className="relative h-20 flex-grow">
      <Map />
      <Planner />
    </main>
  );
}
