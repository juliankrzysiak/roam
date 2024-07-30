"use client";

import { Day } from "@/types";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { isMobile } from "react-device-detect";
import PDF from "./PDF";

type Props = {
  days: Day[];
};

export default function PDFDeviceCheck({ days }: Props) {
  if (isMobile)
    return (
      <PDFDownloadLink document={<PDF days={days} />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
    );
  return (
    <PDFViewer className="w-full">
      <PDF days={days} />
    </PDFViewer>
  );
}
