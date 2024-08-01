import { ChevronDown, MessageCircleHeart } from "lucide-react";

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

export default function Reviews() {
  return (
    <section className="mt-12 flex w-full flex-col items-center px-8">
      <div className="mb-4 flex w-full max-w-2xl justify-evenly xl:mb-12">
        <div
          className={
            "flex flex-col gap-4 font-display text-5xl text-emerald-950 md:text-6xl lg:gap-6"
          }
        >
          <p>Simple.</p>
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
      <ul className="grid gap-8 lg:gap-12">
        {reviews.map((review) => (
          <Review
            key={review.content}
            name={review.name}
            content={review.content}
          />
        ))}
      </ul>
    </section>
  );
}

interface Props {
  name: string;
  content: string;
}

function Review({ name, content }: Props) {
  return (
    <li className="flex max-w-lg flex-col items-end gap-1 rounded-lg text-slate-100">
      <div className="grid w-full place-content-center rounded-lg bg-emerald-900 px-6 py-6 shadow-sm md:p-8">
        <q className="text-center text-2xl">{content}</q>
      </div>
      <p className="text-slate-700">- {name}</p>
    </li>
  );
}
