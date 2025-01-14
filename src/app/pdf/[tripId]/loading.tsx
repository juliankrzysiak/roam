import { FileText } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid flex-1 place-items-center">
      <FileText className="animate-bounce" size={72} />
    </main>
  );
}
