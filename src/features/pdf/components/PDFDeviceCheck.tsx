"use client";

import { Day } from "@/types";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { isMobile } from "react-device-detect";
import PDF from "./PDF";
import { Button } from "@/components/ui/button";

type Props = {
  days: Day[];
};

export default function PDFDeviceCheck({ days }: Props) {
  if (isMobile)
    return (
      <Button asChild>
        <PDFDownloadLink document={<PDF days={days} />} fileName="somename.pdf">
          Download PDF
        </PDFDownloadLink>
      </Button>
    );
  return (
    <PDFViewer className="h-full w-full">
      <PDF days={days} />
    </PDFViewer>
  );
}
