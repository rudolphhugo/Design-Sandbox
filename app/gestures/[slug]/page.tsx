import { notFound } from "next/navigation";
import { gestures } from "@/lib/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function GesturePage({ params }: Props) {
  const { slug } = await params;
  const entry = gestures.find((g) => g.slug === slug);

  if (!entry) {
    notFound();
  }

  const Component = entry.component;
  return <Component />;
}

export function generateStaticParams() {
  return gestures.map((g) => ({ slug: g.slug }));
}
