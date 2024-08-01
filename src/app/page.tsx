"use client";

import Footer from "@/components/general/Footer";
import Action from "@/features/landing/components/Action";
import Features from "@/features/landing/components/Features";
import Hero from "@/features/landing/components/Hero";
import Reviews from "@/features/landing/components/Reviews";

export default function Home() {
  return (
    <>
      <main className="topography flex w-full flex-col items-center gap-12 overflow-clip">
        <Hero />
        <Features />
        <Reviews />
        <Action />
      </main>
      <Footer />
    </>
  );
}
