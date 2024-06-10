"use client";

import { Day } from "@/types";
import { ReactElement, createContext } from "react";

export const DayContext = createContext({} as Day);

type Props = {
  children: ReactElement;
  day: Day;
};

export default function DayProvider({ children, day }: Props) {
  return <DayContext.Provider value={day}>{children}</DayContext.Provider>;
}
