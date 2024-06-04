"use client";

import { DayInfo } from "@/types";
import { ReactElement, createContext } from "react";

export const DayContext = createContext({} as DayInfo);

type Props = {
  children: ReactElement;
  dayInfo: DayInfo;
};

export default function DayProvider({ children, dayInfo }: Props) {
  return <DayContext.Provider value={dayInfo}>{children}</DayContext.Provider>;
}
