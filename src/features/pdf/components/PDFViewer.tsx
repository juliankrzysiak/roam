"use client";

import { PDFViewer } from "@react-pdf/renderer";

type ViewerProps = {
  children: React.ReactNode;
};

export default function Viewer({ children }: ViewerProps) {
  return <PDFViewer>{children}</PDFViewer>;
}
