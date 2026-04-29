import type { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { BicepPlayground } from '@/components/playground/BicepPlayground';

export const metadata: Metadata = {
  title: 'Bicep Playground — Live IaC + NIST 800-53 Compliance Analyzer',
  description:
    'Write Azure Bicep IaC and instantly see ARM JSON output plus NIST 800-53 Rev 5 compliance coverage, security findings, and FedRAMP readiness score.',
  openGraph: {
    title: 'Bicep Playground — Live IaC + NIST 800-53 Compliance Analyzer',
    description:
      'Write Azure Bicep IaC and instantly see ARM JSON output plus NIST 800-53 Rev 5 compliance coverage, security findings, and FedRAMP readiness score.',
    url: 'https://www.cloudcraftwithfranck.org/playground',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bicep Playground — Live IaC + NIST 800-53 Compliance Analyzer',
    description:
      'Write Azure Bicep IaC and instantly see ARM JSON output plus NIST 800-53 Rev 5 compliance coverage, security findings, and FedRAMP readiness score.',
  },
};

export default function PlaygroundPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  return (
    <div style={{ position: 'fixed', inset: 0, top: 'var(--header-height, 56px)', zIndex: 0, overflow: 'hidden' }}>
      <BicepPlayground />
    </div>
  );
}
