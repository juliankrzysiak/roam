"use client";

import PDF from "@/features/pdf/components/PDF";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function PDFPage() {
  return (
    <PDFViewer className="w-full flex-grow">
      <PDF />
    </PDFViewer>
  );
}
