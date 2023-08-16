import Map from "@/features/map/components/Map";
import Planner from "@/features/map/components/Planner";

export default function MapPage() {
  return (
    <main className="relative h-20 flex-grow">
      <Map />
      <Planner />
    </main>
  );
}
