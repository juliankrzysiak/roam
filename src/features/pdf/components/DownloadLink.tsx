"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./PDF";
import { Day } from "@/types";

type Props = {
  days: Day[];
};

export default function DownloadLink({ days }: Props) {
  return (
    <PDFDownloadLink document={<PDF days={days} />} fileName="somename.pdf" className="lg:hidden">
      {({ blob, url, loading, error }) =>
        loading ? "Loading document..." : "Download now!"
      }
    </PDFDownloadLink>
  );
}
