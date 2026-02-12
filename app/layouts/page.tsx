import { layouts } from "@/lib/registry";
import Link from "next/link";

export default function LayoutsIndex() {
  if (layouts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No layouts registered yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Layouts</h2>
      <ul className="space-y-2">
        {layouts.map((l) => (
          <li key={l.slug}>
            <Link
              href={`/layouts/${l.slug}`}
              className="text-primary hover:underline"
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
