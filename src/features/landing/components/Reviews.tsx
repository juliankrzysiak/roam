import { volkhorn } from "@/app/fonts";
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
    <section className="px-8">
      <div className="mb-4 flex justify-evenly">
        <div
          className={
            "flex flex-col gap-4 font-display text-5xl text-emerald-950"
          }
        >
          <p>Simple.</p>
          <p>Fast.</p>
          <p>Fun!</p>
        </div>
        <div className="-mt-12 flex flex-col items-center text-emerald-900">
          <hr className="h-72 border-l-2 border-dashed border-emerald-900"></hr>
          <ChevronDown size={24} className="-mt-2 " />
        </div>
      </div>
      <div className="relative">
        <h2 className="text-center font-display text-4xl">
          What do people love about us?
        </h2>
        <MessageCircleHeart className="absolute -right-3 -top-3" size={24} />
      </div>
      {reviews.map((review) => (
        <Review
          key={review.content}
          name={review.name}
          content={review.content}
        />
      ))}
    </section>
  );
}

interface Props {
  name: string;
  content: string;
}

function Review({ name, content }: Props) {
  return (
    <article className="flex max-w-lg flex-col items-center gap-4 rounded-lg p-8 text-emerald-900">
      <div className="flex ">
        <p className="text-center">&quot;{content}&quot;</p>
      </div>
    </article>
  );
}
