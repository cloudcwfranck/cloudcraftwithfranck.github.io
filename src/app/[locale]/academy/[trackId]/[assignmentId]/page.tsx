'use client';

import dynamic from 'next/dynamic';

const AssignmentPageClient = dynamic(() => import('./_client'), {
    ssr: false,
    loading: () => null,
});

export default function AssignmentPage({
    params,
}: {
    params: { locale: string; trackId: string; assignmentId: string };
}) {
    return <AssignmentPageClient trackId={params.trackId} assignmentId={params.assignmentId} />;
}
