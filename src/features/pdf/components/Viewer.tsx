"use client";

import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);
import PDF from "./PDF";
import { Day } from "@/types";

type ViewerProps = { days: Day[] };

export default function Viewer({ days }: ViewerProps) {
  return (
    <PDFViewer className="hidden w-full lg:block">
      <PDF days={days} />
    </PDFViewer>
  );
}
