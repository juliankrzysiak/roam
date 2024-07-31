const reviews = [
  {
    name: "Julian Krzysiak",
    review:
      "Really great service they have, and for free? How fo they do it? Must have taken them a while to make something like this.",
  },
  {
    name: "Mike Wazowski",
    review: "Whenver I need to plan a road trip, I stick with ROAM.",
  },
  {
    name: "Kulian Jrzysiak",
    review:
      "Amazing! Try it out, you don't wanna miss it. Please try it out. Please...",
  },
];

export default function Testimonials() {
  return (
    <section className="grid gap-10  text-xl">
      {reviews.map((review) => (
        <Review key={review.name} name={review.name} review={review.review} />
      ))}
    </section>
  );
}

interface Props {
  name: string;
  review: string;
}

function Review({ name, review }: Props) {
  return (
    <article className="flex max-w-lg flex-col items-center gap-4 rounded-lg p-8 text-emerald-900">
      <div className="flex flex-col gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-20"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        <h3>{name}</h3>
      </div>
      <p className="text-center">&quot;{review}&quot;</p>
    </article>
  );
}
