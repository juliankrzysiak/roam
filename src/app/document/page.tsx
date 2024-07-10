"use client";

import MyDocument from "@/features/document/components/MyDocument";
import { PDFViewer } from "@react-pdf/renderer";

export default function Document() {
  return (
    <PDFViewer className="w-full flex-grow">
      <MyDocument />
    </PDFViewer>
  );
}
