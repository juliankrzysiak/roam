import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
  handleSubmit: (formData: FormData) => void;
};

export default function ConfirmDialog({ children, handleSubmit }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <form className="flex justify-between" action={handleSubmit}>
          <DialogClose asChild>
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Go Back
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
