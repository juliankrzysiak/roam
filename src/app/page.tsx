import Footer from "@/components/general/Footer";
import Demo from "@/features/auth/components/Demo";
import SignUp from "@/features/auth/components/SignUp";
import SignUpButton from "@/features/landing/components/SignUpButton";
import { createClient } from "@/utils/supabase/server";
import { CornerRightUp, MapPin } from "lucide-react";
import Image from "next/image";

const features: { title: string; content: string }[] = [
  {
    title: "Detailed Planning",
    content:
      "Schedule out start and end times for each location and day of your trip",
  },
  {
    title: "Realtime Updates",
    content:
      "Times and distances are automatically updated between each place - feel free to rearrange your plan as you please",
  },
  {
    title: "Share with Others",
    content:
      "Share your trip ideas with others. Don't worry, they won't be able to mess up your hard work",
  },
  {
    title: "Take it Offline",
    content: "Print our your itinerary for those backcountry hikes and drives",
  },
];

const reviews: { name: string; content: string; imagePath: string }[] = [
  {
    name: "Julian K.",
    content: "Really good app, I use it every time I need to plan a trip.",
    imagePath: "/selfie.jpg",
  },
  {
    name: "Julian K.",
    content: "Used this to plan out my vacation to the Hollywood Walk of Fame!",
    imagePath: "/selfie3.jpg",
  },
  {
    name: "Julian K.",
    content:
      "What a service, you gotta try it out! Whoever made this did a really good job!",
    imagePath: "/selfie2.jpg",
  },
];

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isUser = Boolean(user);

  return (
    <>
      <main className="flex w-full flex-col items-center overflow-clip">
        <div className="flex min-h-[75vh] w-full flex-col justify-between bg-[url('/roadtrip.jpg')] bg-cover bg-top p-4">
          <h2 className="font-display text-4xl min-[400px]:text-5xl  sm:text-6xl lg:text-7xl xl:text-8xl">
            Plan your dream
            <br />
            <i className="fade-in-right inline-block text-emerald-900">
              road trip
            </i>{" "}
            today
          </h2>
          <div className="flex w-fit flex-col items-center gap-6 self-center rounded-lg px-12 py-8">
            <SignUp isUser={isUser} />
            <Demo />
          </div>
        </div>
        <Features features={features} />
        <div className="flex flex-col items-center px-4 py-8">
          <h3 className="mb-8 font-display text-4xl">Plans & Pricing</h3>
          <div className="topography max-w-sm rounded-md border-2 border-t-8 border-slate-900 border-t-emerald-900 px-4 py-2 shadow-lg">
            <div className="mb-8 flex flex-col gap-1">
              <h4 className="font-display text-4xl">Simple</h4>
              <p className="text-slate-700">
                Plan out a single road trip and check if you enjoy our process.
              </p>
            </div>
            <div className="mb-4 flex w-full flex-col gap-2">
              <span className="font-display text-4xl text-emerald-900">
                $0/mo
              </span>
              <SignUpButton text="Create Account" className="w-full" />
            </div>
            <p className="mb-2">Plan details:</p>
            <ul className="flex flex-col gap-2">
              <li>
                <span className="flex items-baseline gap-2 font-light">
                  <MapPin size={16} />
                  Plan out one road trip
                </span>
              </li>
              <li>
                <span className="flex items-baseline gap-2 font-light">
                  <MapPin size={16} />
                  Map out with one or multiple days
                </span>
              </li>
              <li>
                <span className="flex items-baseline gap-2 font-light">
                  <MapPin size={16} />
                  Use google maps to plan your locations
                </span>
              </li>
              <li>
                <span className="flex items-baseline gap-2 font-light">
                  <MapPin size={16} />
                  And much more
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <p className=" font-silly text-3xl">Thats all we got for now</p>
            <CornerRightUp />
          </div>
        </div>
        <div className="my-24 flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
          <div className="relative flex flex-col items-center ">
            <h2 className="font-display text-4xl  lg:text-7xl">
              all roads lead to <br />
              <b className="text-7xl tracking-widest text-emerald-900 min-[375px]:text-8xl lg:text-9xl">
                ROAM
              </b>
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
          <SignUpButton
            text="Start Planning Today"
            className="h-full w-full max-w-lg bg-emerald-800 py-2 text-2xl text-slate-100"
          />
        </div>
        <Reviews reviews={reviews} />
      </main>
      <Footer />
    </>
  );
}

type FeaturesProps = {
  features: { title: string; content: string }[];
};

export function Features({ features }: FeaturesProps) {
  return (
    <div className="w-full bg-emerald-950 px-4 py-12">
      <ul className="mx-auto grid w-full place-content-center place-items-center gap-12 sm:grid-cols-2">
        {features.map(({ title, content }, i) => {
          return (
            <li
              key={title}
              className="flex h-full max-w-2xl flex-col gap-2 text-center text-emerald-50"
            >
              <h3 className="font-display text-5xl font-bold sm:text-6xl">
                {title}
              </h3>
              <p className="text-emerald-100 lg:text-xl">{content}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type ReviewsProps = {
  reviews: {
    name: string;
    content: string;
    imagePath: string;
  }[];
};

function Reviews({ reviews }: ReviewsProps) {
  return (
    <ul className="mb-16 flex w-full flex-wrap justify-center gap-8 px-4">
      {reviews.map(({ name, content, imagePath }, i) => {
        return (
          <li
            key={i}
            className="relative flex w-full max-w-sm flex-col items-center gap-4 overflow-hidden rounded-lg px-4 py-6 text-center text-emerald-50"
          >
            <div className="noise absolute -z-10 mt-16 h-full w-full rounded-lg bg-emerald-900"></div>
            <div className="item-center flex flex-col gap-1">
              <Image
                className="relative w-36 rounded-xl border border-emerald-900"
                src={imagePath}
                width={640}
                height={640}
                alt="Selfie of Julian Krzysiak"
              />
              <h4 className="font-display font-light opacity-75">{name}</h4>
            </div>
            <blockquote className="text-xl before:content-['\201C'] after:content-['\201D']">
              {content}
            </blockquote>
          </li>
        );
      })}
    </ul>
  );
}
