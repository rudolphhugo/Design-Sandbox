import { redirect } from "next/navigation";
import { components } from "@/lib/registry";

export default function Home() {
  if (components.length > 0) {
    redirect(`/components/${components[0].slug}`);
  }

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-muted-foreground">No components registered yet.</p>
    </div>
  );
}
