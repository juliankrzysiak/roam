interface Props {
  name: string;
  review: string;
}

export default function Review({ name, review }: Props) {
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
