import Footer from "@/components/general/Footer";
import { Button } from "@/components/ui/button";
import Demo from "@/features/auth/components/Demo";
import SignUp from "@/features/auth/components/StartPlanning";
import Features from "@/features/landing/components/Features";
import MovingCar from "@/features/landing/components/MovingCar";
import Reviews from "@/features/landing/components/Reviews";
import { ChevronDown, Flag, MapPin } from "lucide-react";
import Link from "next/link";

const features = [
  "Quickly create a scheduled itinerary for a fun day trip or an exciting journey across the states.",
  "Get a bird's eye view of your trip. See all your stops on a map, know when your day will end, and see how many miles you'll go.",
  "Print our trip details when you're done for those remote destinations.",
  "Enjoy planning your trips for free... for now!",
];

const reviews = [
  {
    name: "Julian K.",
    content: "So easy to use!",
  },
  {
    name: "Julian K.",
    content:
      "Used this to plan out my vacation. I planned out every single detail, got to see so many things!",
  },
  {
    name: "Julian K.",
    content:
      "What a service, you gotta try it out! Whoever made this did a good job!",
  },
];

export default function Home() {
  return (
    <>
      <main className="topography flex w-full flex-col items-center overflow-clip">
        <section className="my-12 flex w-full flex-col items-center justify-center gap-12 px-8">
          <div className="flex w-full flex-col text-center">
            <h1 className="mb-2 text-center font-display text-7xl text-emerald-950 min-[425px]:text-8xl lg:text-9xl ">
              Explore <br /> the <br /> World
            </h1>
            <div className="mb-8 flex w-full">
              <MapPin size={36} />
              <MovingCar />
              <Flag size={36} />
            </div>
            <h2 className="text-4xl">Map out your next roadtrip with ease</h2>
          </div>
          <div className="flex flex-col items-center gap-2">
            <SignUp />
            or
            <Demo />
          </div>
        </section>
        <section className="noise flex w-full flex-col items-center gap-8 bg-emerald-900 px-8 py-12 shadow-lg">
          <h3 className="text-center font-display text-4xl text-slate-100 md:text-5xl">
            with <span className="font-bold">roam</span> you can
          </h3>
          <Features features={features} />
        </section>
        <section className="mt-12 flex w-full flex-col items-center px-8">
          <div className="mb-4 flex w-full max-w-2xl justify-evenly xl:mb-12">
            <div
              className={
                "flex flex-col gap-4 font-display text-5xl text-emerald-950 md:text-6xl lg:gap-6"
              }
            >
              <p>Detailed.</p>
              <p>Fast.</p>
              <p>Fun!</p>
            </div>
            <div className="-mt-24 flex flex-col items-center text-emerald-900">
              <hr className="h-96 border-l-2 border-dashed border-emerald-900"></hr>
              <ChevronDown size={24} className="-mt-2 " />
            </div>
          </div>
          <h2 className="mb-12 text-center font-display text-4xl md:text-5xl xl:mb-16">
            What do people love about us?
          </h2>
          <Reviews reviews={reviews} />
        </section>
        <section className="mb-12 flex flex-col items-center justify-center gap-8 px-8 py-36 text-center xl:py-52">
          <div className="relative flex flex-col items-center gap-4">
            <h2 className="font-display text-6xl text-emerald-950 lg:text-7xl">
              All Roads Lead to <br />
              <span className="text-8xl font-medium lg:text-9xl">roam</span>
            </h2>
            <div className="absolute top-1/2 -z-10 flex w-[3000px] rotate-45 flex-col gap-4 opacity-25 blur-[1px]">
              <div className="flex h-12 w-full items-center border-y-2 border-slate-900">
                <hr className="w-full  border-2 border-dashed border-slate-900" />
              </div>
              <div className="flex h-12 w-full items-center border-y-2 border-slate-900">
                <hr className="w-full  border-2 border-dashed border-slate-900" />
              </div>
            </div>
          </div>
          <Button
            asChild
            className="h-full w-full max-w-lg bg-emerald-800  py-2 text-2xl text-slate-100"
          >
            <Link href="#">Start planning today</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
