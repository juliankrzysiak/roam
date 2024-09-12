"use client";

import { isPlannerVisibleAtom } from "@/lib/atom";
import { useAtom } from "jotai";

export default function TogglePlannerButton() {
  const [visible, setVisible] = useAtom(isPlannerVisibleAtom);

  function handleClick() {
    setVisible(!visible);
  }
  return (
    <button
      className="bg-emerald-700 py-2 text-lg font-medium text-slate-100 sm:hidden"
      onClick={handleClick}
    >
      <span>Switch to {visible ? "Map" : "Planner"}</span>
    </button>
  );
}
