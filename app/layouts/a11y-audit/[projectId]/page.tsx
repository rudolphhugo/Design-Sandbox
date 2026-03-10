import { ProjectOverview } from "@/components/audit/ProjectOverview";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { projectId } = await params;
  return <ProjectOverview projectId={projectId} />;
}
