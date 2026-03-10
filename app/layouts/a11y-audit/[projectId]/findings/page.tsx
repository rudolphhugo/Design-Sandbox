import { FindingsDashboard } from "@/components/audit/FindingsDashboard";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function FindingsPage({ params }: Props) {
  const { projectId } = await params;
  return <FindingsDashboard projectId={projectId} />;
}
