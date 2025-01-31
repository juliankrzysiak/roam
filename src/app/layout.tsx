import "@/app/globals.css";
import Header from "@/components/general/Header";
import { Toaster } from "@/components/ui/toaster";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Metadata } from "next";
import { inter, averiaSerifLibre, caveat } from "./fonts";

export const metadata: Metadata = {
  title: "roam",
  description: "Plan your dream road trip today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${averiaSerifLibre.variable} ${caveat.variable}`}
    >
      <body className="flex min-h-full flex-col bg-emerald-50 text-slate-900">
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
