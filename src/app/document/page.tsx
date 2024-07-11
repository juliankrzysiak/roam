"use client";

import MyDocument from "@/features/document/components/MyDocument";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function Document() {
  return (
    <PDFViewer className="w-full flex-grow">
      <MyDocument />
    </PDFViewer>
  );
}
