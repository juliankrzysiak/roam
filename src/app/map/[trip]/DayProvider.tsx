"use client";

import { DayInfo } from "@/types";
import { ReactNode, createContext } from "react";

export const DayContext = createContext({});

type Props = {
  children: ReactNode;
  dayInfo: DayInfo;
};

export default function DayProvider({ children, dayInfo }: Props) {
  return <DayContext.Provider value={dayInfo}>{children}</DayContext.Provider>;
}
