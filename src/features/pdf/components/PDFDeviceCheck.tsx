"use client";

import { Day } from "@/types";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { isMobile } from "react-device-detect";
import PDF from "./PDF";
import { Button } from "@/components/ui/button";

type Props = {
  days: Day[];
  tripName: string;
};

export default function PDFDeviceCheck({ days, tripName }: Props) {
  if (isMobile)
    return (
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl">{tripName}</h2>
        <Button size="lg" className="text-xl" asChild>
          <PDFDownloadLink document={<PDF days={days} />}>
            Download PDF
          </PDFDownloadLink>
        </Button>
      </div>
    );
  return (
    <PDFViewer className="h-full w-full">
      <PDF days={days} />
    </PDFViewer>
  );
}
