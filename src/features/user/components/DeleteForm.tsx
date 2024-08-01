import { Button } from "@/components/ui/button";

export default function DeleteForm() {
  return (
    <div className="flex w-fit flex-col items-center gap-4">
      <Button variant="destructive">Delete Data</Button>
      <Button variant="destructive">Delete Account + Data</Button>
    </div>
  );
}
