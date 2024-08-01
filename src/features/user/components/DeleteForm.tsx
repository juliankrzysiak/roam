import ConfirmDialog from "@/components/general/ConfirmDialog";
import { Button } from "@/components/ui/button";

export default function DeleteForm() {
  return (
    <div className="flex w-fit flex-col items-center gap-4">
      <ConfirmDialog handleSubmit={() => console.log(123)}>
        <Button variant="destructive">Delete Data</Button>
      </ConfirmDialog>
      <Button variant="destructive">Delete Account + Data</Button>
    </div>
  );
}
