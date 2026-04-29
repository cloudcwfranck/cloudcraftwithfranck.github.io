import dynamic from 'next/dynamic';

const AssignmentPageContent = dynamic(
    () => import('@/components/academy/AssignmentPageContent'),
    { ssr: false, loading: () => null },
);

export default function AssignmentPage({
    params,
}: {
    params: { locale: string; trackId: string; assignmentId: string };
}) {
    return <AssignmentPageContent trackId={params.trackId} assignmentId={params.assignmentId} />;
}
