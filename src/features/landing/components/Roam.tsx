"use client";

import clsx from "clsx";
import { useIntersection } from "../hooks";

export default function Roam() {
  const [intersectionRef, isVisible] = useIntersection({ threshold: 0.75 });
  return (
    <div className="relative flex flex-col items-center ">
      <h2 className="font-display text-4xl  lg:text-7xl">
        all roads lead to <br />
        <b
          ref={intersectionRef}
          className="text-7xl tracking-widest text-emerald-900 min-[375px]:text-8xl lg:text-9xl"
        >
          ROAM
        </b>
      </h2>
      <div
        className={clsx(
          "delay-250 absolute top-1/2 -z-10 flex w-[3000px] flex-col gap-4 opacity-25 blur-[1px] duration-1000",
          isVisible ? "rotate-0" : "rotate-45",
        )}
      >
        <div className="flex h-12 w-full items-center border-y-2 border-slate-900">
          <hr className="w-full  border-2 border-dashed border-slate-900" />
        </div>
        <div className="flex h-12 w-full items-center border-y-2 border-slate-900">
          <hr className="w-full  border-2 border-dashed border-slate-900" />
        </div>
      </div>
    </div>
  );
}
