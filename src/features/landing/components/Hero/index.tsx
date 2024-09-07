import Demo from "@/features/auth/components/Demo";
import SignUp from "@/features/auth/components/StartPlanning";
import { Flag, MapPin } from "lucide-react";
import MovingCar from "./MovingCar";

export default function Hero() {
  return (
    <section className="my-12 flex flex-col items-center justify-center gap-16 px-8 lg:my-24 xl:my-36">
      <div className="flex flex-col text-center">
        <h1 className="text-center font-display text-7xl text-emerald-950 min-[425px]:text-8xl lg:text-9xl  ">
          Explore the World
        </h1>
        <div className="mb-8 flex w-full">
          <MapPin size={36} />
          <MovingCar />
          <Flag size={36} />
        </div>
        <h2 className="text-4xl">Map out your next roadtrip with ease</h2>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SignUp />
        or
        <Demo />
      </div>
    </section>
  );
}
