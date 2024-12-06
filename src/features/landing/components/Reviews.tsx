type Props = {
  reviews: { name: string; content: string }[];
};

export default function Reviews({ reviews }: Props) {
  return (
    <ul className="grid gap-8 lg:gap-12">
      {reviews.map((review, i) => {
        return (
          <li
            key={i}
            className="flex max-w-lg flex-col items-end gap-1 rounded-lg text-slate-100"
          >
            <div className="noise grid w-full place-content-center rounded-lg bg-emerald-900 px-6 py-6 shadow-sm md:p-8">
              <q className="text-center text-2xl">{review.content}</q>
            </div>
            <p className="text-slate-700">- {review.name}</p>
          </li>
        );
      })}
    </ul>
  );
}
