import dynamic from 'next/dynamic';

export const dynamicParams = true;

const AssignmentPageClient = dynamic(() => import('./_client'), { ssr: false });

export default function AssignmentPage({
    params,
}: {
    params: { locale: string; trackId: string; assignmentId: string };
}) {
    return <AssignmentPageClient trackId={params.trackId} assignmentId={params.assignmentId} />;
}
