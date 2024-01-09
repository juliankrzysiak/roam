import Link from "next/link";

type Props = {
  orderDays: string[];
  dayId: string;
};

export default function NavigateDays({ orderDays, dayId }: Props) {
  const currentIndex = orderDays.findIndex((id) => id === dayId);
  return (
    <div>
      <Link href={`${orderDays[currentIndex - 1]}`}>Previous</Link>
      <span>Day: {}</span>
      <Link href={`${orderDays[currentIndex + 1]}`}>Next</Link>
    </div>
  );
}
