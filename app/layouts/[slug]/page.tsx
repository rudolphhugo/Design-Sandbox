import { notFound } from "next/navigation";
import { layouts } from "@/lib/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LayoutPage({ params }: Props) {
  const { slug } = await params;
  const entry = layouts.find((l) => l.slug === slug);

  if (!entry) {
    notFound();
  }

  const LayoutComponent = entry.component;

  return <LayoutComponent />;
}

export function generateStaticParams() {
  return layouts.map((l) => ({ slug: l.slug }));
}
