import { ReportView } from "@/components/audit/ReportView";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ReportPage({ params }: Props) {
  const { projectId } = await params;
  return <ReportView projectId={projectId} />;
}
