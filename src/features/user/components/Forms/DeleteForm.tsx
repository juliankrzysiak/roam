import ConfirmDialog from "@/components/general/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteData } from "@/utils/actions/crud/delete";

export default function DeleteForm() {
  const { toast } = useToast();
  async function handleDeleteData() {
    try {
      await deleteData();
      toast({
        description: "Your data has been deleted.",
      });
    } catch (error) {
      if (typeof error !== "string") return;
      toast({ title: "Uh oh, something went wrong!", description: error });
    }
  }

  return (
    <div className="flex w-fit flex-col items-center gap-4">
      <ConfirmDialog handleSubmit={handleDeleteData}>
        <Button variant="destructive">Delete Data</Button>
      </ConfirmDialog>
      <ConfirmDialog handleSubmit={() => console.log(123)}>
        <Button variant="destructive">Delete Account + Data</Button>
      </ConfirmDialog>
    </div>
  );
}
