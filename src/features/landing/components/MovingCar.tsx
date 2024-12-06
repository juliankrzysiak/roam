"use client";

import { Car } from "lucide-react";
import { useEffect, useRef } from "react";

export default function MovingCar() {
  const boundsRef = useRef<HTMLDivElement>(null);
  const movingRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!boundsRef.current || !movingRef.current) return;
    const leftBound = boundsRef.current.getBoundingClientRect().left;
    const rightBound = boundsRef.current.getBoundingClientRect().right;
    const width = movingRef.current?.getBoundingClientRect().width;

    function debounce(callback: unknown, wait: number) {
      let timeoutId: number | null = null;
      return (...args: unknown[]) => {
        if (timeoutId) window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          // @ts-expect-error
          callback.apply(null, args);
        }, wait);
      };
    }

    let previousMouseX = 0;
    function mouseMoveHandler(ev: PointerEvent) {
      debounce(
        requestAnimationFrame(() => {
          if (!movingRef.current) return;
          const mouseX = ev.clientX - leftBound - width / 2;
          const directionX = Math.sign(mouseX - previousMouseX);
          if (mouseX > 0 && mouseX < rightBound - leftBound - width) {
            movingRef.current.style.transform = `translateX(${mouseX}px) scaleX(${directionX})`;
          }
          previousMouseX = mouseX;
        }),
        2000,
      );
    }

    document.addEventListener("pointermove", mouseMoveHandler);

    return () => document.removeEventListener("pointermove", mouseMoveHandler);
  }, []);
  return (
    <div className="flex w-full flex-col" ref={boundsRef}>
      <Car size={36} ref={movingRef} className="duration-1000 ease-out" />
      <div className="mr-1 flex-1 border-b border-dashed border-slate-900"></div>
    </div>
  );
}
