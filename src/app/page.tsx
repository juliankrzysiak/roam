"use client";

import Features from "@/features/landing/components/Features";
import Hero from "@/features/landing/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-8">
      <Hero />
      <Features />
      <section className="text-xl">
        <h1 className="my-6 text-6xl">Testimonials</h1>
        <p>Planning has never been so fun!</p>
        <p>I love this service, how is it free!!??</p>
        <p>Awesome</p>
        <p>Really good stuff mate, keep it up!</p>
      </section>
    </main>
  );
}
