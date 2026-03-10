import { CriteriaWorkspace } from "@/components/audit/CriteriaWorkspace";

interface Props {
    params: Promise<{ projectId: string }>;
}

export default async function CriteriaPage({ params }: Props) {
    const { projectId } = await params;
    return <CriteriaWorkspace projectId={projectId} />;
}
