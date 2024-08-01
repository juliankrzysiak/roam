import { Button } from "@/components/ui/button";
import DemoButton from "@/features/auth/components/DemoButton";
import { isSignUpFormVisibleAtom } from "@/lib/atom";
import { useSetAtom } from "jotai";
import { Flag, MapPin } from "lucide-react";

export default function Hero() {
  const setOpen = useSetAtom(isSignUpFormVisibleAtom);

  return (
    <section className="my-12 flex flex-col items-center justify-center gap-16 px-8 lg:my-24 xl:my-36">
      <div className="flex flex-col text-center">
        <h1 className="text-center font-display text-7xl text-emerald-950 min-[425px]:text-8xl lg:text-9xl  ">
          Explore the World
        </h1>
        <div className="mb-8 flex w-full">
          <MapPin size={36} />
          <div className="mr-1 flex-1 border-b border-dashed border-slate-900"></div>
          <Flag size={36} />
        </div>
        <h2 className="text-4xl">Map out your next roadtrip with ease</h2>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button
          className="bg-emerald-800 py-6 text-lg xl:text-xl"
          onClick={() => setOpen(true)}
        >
          Start planning
        </Button>
        or
        <DemoButton />
      </div>
    </section>
  );
}
