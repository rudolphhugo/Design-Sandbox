import { notFound } from "next/navigation";
import { animations } from "@/lib/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AnimationPage({ params }: Props) {
  const { slug } = await params;
  const entry = animations.find((a) => a.slug === slug);

  if (!entry) {
    notFound();
  }

  const Component = entry.component;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{entry.name}</h2>
      <Component />
    </div>
  );
}

export function generateStaticParams() {
  return animations.map((a) => ({ slug: a.slug }));
}
