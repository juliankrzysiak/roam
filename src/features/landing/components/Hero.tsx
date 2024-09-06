"use client";

import Demo from "@/features/auth/components/Demo";
import SignUp from "@/features/auth/components/StartPlanning";
import { Car, Flag, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Hero() {
  const boundsRef = useRef<HTMLDivElement>(null);
  const movingRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!boundsRef.current || !movingRef.current) return;
    const leftBound = boundsRef.current.getBoundingClientRect().left;
    const rightBound = boundsRef.current.getBoundingClientRect().right;
    const width = movingRef.current?.getBoundingClientRect().width;

    function mouseMoveHandler(ev: MouseEvent) {
      requestAnimationFrame(() => {
        if (!movingRef.current) return;
        const mouseX = ev.clientX - leftBound - width / 2;
        if (mouseX > 0 && mouseX < rightBound - leftBound - width) {
          movingRef.current.style.transform = `translateX(${mouseX}px)`;
        }
      });
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);
  return (
    <section className="my-12 flex flex-col items-center justify-center gap-16 px-8 lg:my-24 xl:my-36">
      <div className="flex flex-col text-center">
        <h1 className="text-center font-display text-7xl text-emerald-950 min-[425px]:text-8xl lg:text-9xl  ">
          Explore the World
        </h1>
        <div className="mb-8 flex w-full">
          <MapPin size={36} />
          <div className="flex w-full flex-col" ref={boundsRef}>
            <Car
              size={36}
              ref={movingRef}
              className=" duration-1000 ease-out"
            />
            <div className="mr-1 flex-1 border-b border-dashed border-slate-900"></div>
          </div>
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
