import "@/app/globals.css";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Journey",
  description: "Plan your next adventure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body className="relative flex min-h-screen flex-col">
        <Header />
        <main className="relative flex flex-col items-center gap-36 p-20">
          {children}
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
