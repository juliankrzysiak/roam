"use client";

import { isPlannerVisibleAtom } from "@/lib/atom";
import { useAtom } from "jotai";
import { List, Map } from "lucide-react";

export default function TogglePlannerButton() {
  const [visible, setVisible] = useAtom(isPlannerVisibleAtom);

  function handleClick() {
    setVisible(!visible);
  }
  return (
    <button
      className="absolute bottom-6 right-4 z-20 rounded-full bg-emerald-700 p-3 text-slate-300 shadow-md sm:hidden"
      onClick={handleClick}
    >
      {visible ? <Map /> : <List />}
    </button>
  );
}
