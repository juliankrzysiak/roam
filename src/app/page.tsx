"use client";

import Feature from "@/features/landing/components/Feature";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const features = [
    "Quickly create a scheduled itinerary for a fun day trip, or an exciting journey across the states",
    "Create lists of your favorite places. When you’re done, simply drag and drop them into your schedule.",
    "Free to use, no account required. Or create one to save everything for future inspiration!",
  ];

  const loginModal = useRef<HTMLDialogElement>(null);

  return (
    <main className="relative flex flex-col items-center gap-36 p-20">
      <section className=" w-fit text-center">
        <h1 className="my-6 text-7xl">Explore the World</h1>
        <h2 className="mb-8 text-4xl">
          Simplicity and ease in planning your adventures.
        </h2>
        <Link
          href={"/map"}
          className="rounded-lg bg-emerald-600 px-2 py-3 text-2xl font-bold text-gray-100"
        >
          Get Started
        </Link>
      </section>
      <section className="flex flex-col gap-20">
        {features.map((content) => (
          <Feature key={content}>{content}</Feature>
        ))}
      </section>
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
