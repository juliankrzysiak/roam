import ConfirmDialog from "@/components/general/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteAccount, deleteData } from "@/utils/actions/crud/delete";

export default function DeleteForm() {
  const { toast } = useToast();

  async function handleDeleteData() {
    const message = await deleteData();
    toast(message);
  }

   async function handleDeleteAccount() {
     const message = await deleteAccount();
     toast(message);
   }

  return (
    <div className="flex w-fit flex-col items-center gap-4">
      <ConfirmDialog handleSubmit={handleDeleteData}>
        <Button variant="destructive">Delete Data</Button>
      </ConfirmDialog>
      <ConfirmDialog handleSubmit={handleDeleteAccount}>
        <Button variant="destructive">Delete Account + Data</Button>
      </ConfirmDialog>
    </div>
  );
}

