import { notFound } from "next/navigation";
import { components } from "@/lib/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const entry = components.find((c) => c.slug === slug);

  if (!entry) {
    notFound();
  }

  const Component = entry.component;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{entry.name}</h2>
      {entry.showcase ? (
        <Component />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Component />
          <Component />
          <Component />
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}
