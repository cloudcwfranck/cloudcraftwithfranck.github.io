import dynamic from 'next/dynamic';

export const dynamicParams = true;

// ssr:false means Next.js never renders this on the server —
// the server sends an empty shell and the client renders everything.
// This is the only reliable way to prevent React hydration error #418
// for pages that depend entirely on client-side state and browser APIs.
const TrackPageClient = dynamic(() => import('./_client'), { ssr: false });

export default function TrackPage({
    params,
}: {
    params: { locale: string; trackId: string };
}) {
    return <TrackPageClient trackId={params.trackId} />;
}
