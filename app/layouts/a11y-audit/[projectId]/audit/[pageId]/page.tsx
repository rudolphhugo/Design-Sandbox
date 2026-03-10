import { AuditWorkspace } from "@/components/audit/AuditWorkspace";

interface Props {
  params: Promise<{ projectId: string; pageId: string }>;
}

export default async function AuditPage({ params }: Props) {
  const { projectId, pageId } = await params;
  return <AuditWorkspace projectId={projectId} pageId={pageId} />;
}
