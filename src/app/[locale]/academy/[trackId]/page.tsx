'use client';

import dynamic from 'next/dynamic';

// ssr:false works ONLY when the calling component is a Client Component.
// Without 'use client' here, Next.js ignores ssr:false and SSRs _client.tsx,
// producing server HTML that diverges from the client's initial state → #418.
const TrackPageClient = dynamic(() => import('./_client'), {
    ssr: false,
    loading: () => null,
});

export default function TrackPage({
    params,
}: {
    params: { locale: string; trackId: string };
}) {
    return <TrackPageClient trackId={params.trackId} />;
}
