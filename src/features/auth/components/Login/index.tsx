import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <Dialog>
      <DialogTrigger className="text-2xl font-semibold">Sign In</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-8">
          <DialogTitle className="text-2xl">
            Log in to your account.
          </DialogTitle>
          <LoginForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
