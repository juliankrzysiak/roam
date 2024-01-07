import { TripInfo } from "@/types";
import styles from "./styles.module.css";

type Props = {
  tripInfo: TripInfo | undefined;
};

export default function Trip({ tripInfo }: Props) {
  if (!tripInfo) return;

  return (
    <div className={styles.container}>
      <span>Duration: {tripInfo.duration} minutes</span>
      <span>Distance: {tripInfo.distance} miles</span>
    </div>
  );
}
