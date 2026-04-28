import { Flex, Heading } from '@/once-ui/components';
import { Mailchimp } from '@/components';
import { Posts } from '@/components/blog/Posts';
import { baseURL, renderContent } from '@/app/resources'
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(
	{params: {locale}}: { params: { locale: string }}
) {
	const title = 'Technical Blog — GovCloud Automation & DevSecOps';
	const description = 'Principal-level technical writing on FedRAMP automation, Azure GCC High, AKS hardening, Platform One, Bicep IaC, NIST 800-53, and DoD cloud architecture. Code included.';
	const ogImage = `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		keywords: ['FedRAMP automation', 'Azure GCC High', 'AKS hardening', 'Platform One', 'Bicep IaC', 'NIST 800-53', 'DevSecOps', 'DoD cloud'],
		openGraph: {
			title,
			description,
			type: 'website',
			url: 'https://www.cloudcraftwithfranck.org/blog',
			images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
		alternates: { canonical: 'https://www.cloudcraftwithfranck.org/blog' },
	};
}

export default function Blog(
	{ params: {locale}}: { params: { locale: string }}
) {
	unstable_setRequestLocale(locale);

	const t = useTranslations();
	const { person, blog, newsletter } = renderContent(t);
    return (
        <Flex
			fillWidth maxWidth="s"
			direction="column">
            <script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Blog',
						headline: blog.title,
						description: blog.description,
						url: `https://${baseURL}/blog`,
						image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
						author: {
							'@type': 'Person',
							name: person.name,
                            image: {
								'@type': 'ImageObject',
								url: `${baseURL}${person.avatar}`,
							},
						},
					}),
				}}
			/>
            <Heading
                marginBottom="l"
                variant="display-strong-s">
                {blog.title}
            </Heading>
			<Flex
				fillWidth flex={1} direction="column">
				<Posts range={[1,3]} locale={locale} thumbnail/>
				<Posts range={[4]} columns="2" locale={locale}/>
			</Flex>
            {newsletter.display && (
                <Mailchimp newsletter={newsletter} />
            )}
        </Flex>
    );
}