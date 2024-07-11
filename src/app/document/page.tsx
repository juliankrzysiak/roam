"use client";

import Document from "@/features/document/components/Document";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

export default function DocumentPage() {
  return (
    <PDFViewer className="w-full flex-grow">
      <Document />
    </PDFViewer>
  );
}
