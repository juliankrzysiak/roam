import { volkhorn } from "@/app/fonts";
import { Button } from "@/components/ui/button";
import { Flag, MapPin } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mt-12 flex flex-col items-center justify-center gap-16">
      <div className="flex flex-col gap-4 text-center">
        <h1 className={`${volkhorn.className} text-8xl text-emerald-950`}>
          Explore the World
        </h1>
        <div className="flex w-full gap-1">
          <MapPin size={36} />
          <div className="flex-1 border-b border-dashed border-slate-900"></div>
          <Flag size={36} />
        </div>
        <h2 className="text-4xl">Map out your next roadtrip with ease</h2>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button className="py-6 text-lg">Start planning</Button>
        or
        <Button variant="outline" className="text-sm">
          Try it out
        </Button>
      </div>
    </section>
  );
}
