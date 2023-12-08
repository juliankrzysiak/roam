"use client";

import Footer from "@/components/general/Footer";
import Action from "@/features/landing/components/Action";
import Features from "@/features/landing/components/Features";
import Hero from "@/features/landing/components/Hero";
import Reviews from "@/features/landing/components/Reviews";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center gap-20 px-8 lg:px-20 ">
        <Hero />
        <Features />
        <Reviews />
        <Action />
      </main>
      <Footer />
    </>
  );
}
