"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import { useState } from "react";

export default function MapSearch() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={clsx(
        "absolute left-2 top-2 flex items-center gap-2 rounded-full border bg-slate-100 p-2 shadow-lg sm:max-w-lg",
        isOpen && "right-2",
      )}
    >
      <Search
        size={20}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />
      {isOpen && (
        <input
          autoFocus
          type="text"
          name="search"
          className="w-full bg-inherit"
        />
      )}
    </div>
  );
}
