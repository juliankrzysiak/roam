import "@/app/globals.css";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import { Toaster } from "@/components/ui/toaster";

const nunitoSans = Nunito_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roam",
  description: "Plan your next adventure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunitoSans.className}>
      <body className="relative flex min-h-screen flex-col bg-gray-100">
        <Header />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
