import { Flex, Heading, Text } from '@/once-ui/components';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ContactForm } from './ContactForm';

export function generateMetadata() {
  const title = 'Contact Franck Kengne';
  const description = 'Consulting inquiries for government cloud architecture, FedRAMP compliance automation, and DevSecOps engagements.';
  const ogImage = `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://www.cloudcraftwithfranck.org/contact',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: 'https://www.cloudcraftwithfranck.org/contact' },
  };
}

export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <Flex maxWidth="s" fillWidth direction="column" gap="l" paddingY="xl">
      <Flex direction="column" gap="s">
        <Heading variant="display-strong-m">Get in Touch</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          Reach out for cloud consulting, speaking engagements, or partnerships. I respond within 1–2 business days.
        </Text>
      </Flex>
      <ContactForm />
    </Flex>
  );
}
