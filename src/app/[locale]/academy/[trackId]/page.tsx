import dynamic from 'next/dynamic';

const TrackPageContent = dynamic(
    () => import('@/components/academy/TrackPageContent'),
    { ssr: false, loading: () => null },
);

export default function TrackPage({
    params,
}: {
    params: { locale: string; trackId: string };
}) {
    return <TrackPageContent trackId={params.trackId} />;
}
