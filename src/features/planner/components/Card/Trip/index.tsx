import { Trip } from "@/types";

type Props = {
  tripInfo: Trip | undefined;
};

export default function Trip({ tripInfo }: Props) {
  if (!tripInfo) return;

  return (
    <div>
      <span>Duration: {tripInfo.duration} minutes</span>
      <span>Distance: {tripInfo.distance} miles</span>
    </div>
  );
}
