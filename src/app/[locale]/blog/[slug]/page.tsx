import ScrollToHash from '@/components/ScrollToHash';
import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { getPosts } from '@/app/utils/utils'
import { Avatar, Button, Flex, Heading, Text } from '@/once-ui/components'

import { baseURL, renderContent } from '@/app/resources'
import { unstable_setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/app/utils/formatDate'

interface BlogParams {
    params: { 
        slug: string;
		locale: string;
    };
}

export async function generateStaticParams() {
	const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts: { slug: string; locale: string }[] = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = getPosts(['src', 'app', '[locale]', 'blog', 'posts', locale]);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export function generateMetadata({ params: { slug, locale } }: BlogParams) {
	const post = getPosts(['src', 'app', '[locale]', 'blog', 'posts', locale]).find((p) => p.slug === slug);

	if (!post) return { title: 'Post Not Found' };

	const { title, publishedAt: publishedTime, summary: description, image, tag } = post.metadata;
	const ogImage = image
		? `https://www.cloudcraftwithfranck.org${image}`
		: `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(title)}`;
	const keywords = tag ? [tag] : [];

	return {
		title,
		description,
		keywords,
		authors: [{ name: 'Franck Kengne' }],
		openGraph: {
			title,
			description,
			type: 'article',
			publishedTime,
			authors: ['Franck Kengne'],
			url: `https://www.cloudcraftwithfranck.org/blog/${slug}`,
			images: [{ url: ogImage, width: 1200, height: 630 }],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
		alternates: { canonical: `https://www.cloudcraftwithfranck.org/blog/${slug}` },
	};
}

export default function Blog({ params }: BlogParams) {
	unstable_setRequestLocale(params.locale);
	let post = getPosts(['src', 'app', '[locale]', 'blog', 'posts', params.locale]).find((post) => post.slug === params.slug)

	if (!post) {
		notFound()
	}

	const t = useTranslations();
	const { person } = renderContent(t);

	return (
		<Flex as="section"
			fillWidth maxWidth="xs"
			direction="column"
			gap="m">
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'TechArticle',
						headline: post.metadata.title,
						datePublished: post.metadata.publishedAt,
						dateModified: post.metadata.publishedAt,
						description: post.metadata.summary,
						keywords: post.metadata.tag ? post.metadata.tag : '',
						image: post.metadata.image
							? `https://www.cloudcraftwithfranck.org${post.metadata.image}`
							: `https://www.cloudcraftwithfranck.org/og?title=${encodeURIComponent(post.metadata.title)}`,
						url: `https://www.cloudcraftwithfranck.org/blog/${post.slug}`,
						author: {
							'@type': 'Person',
							name: 'Franck Kengne',
							url: 'https://www.cloudcraftwithfranck.org',
							jobTitle: 'Principal Cloud & DevSecOps Architect',
						},
						publisher: {
							'@type': 'Person',
							name: 'Franck Kengne',
							url: 'https://www.cloudcraftwithfranck.org',
						},
					}),
				}}
			/>
			<Button
				href={`/${params.locale}/blog`}
				variant="tertiary"
				size="s"
				prefixIcon="chevronLeft">
				Posts
			</Button>
			<Heading
				variant="display-strong-s">
				{post.metadata.title}
			</Heading>
			<Flex
				gap="12"
				alignItems="center">
				{ person.avatar && (
					<Avatar
						size="s"
						src={person.avatar}/>
				)}
				<Text
					variant="body-default-s"
					onBackground="neutral-weak">
					{formatDate(post.metadata.publishedAt)}
				</Text>
			</Flex>
			<Flex
				as="article"
				direction="column"
				fillWidth>
				<CustomMDX source={post.content} />
			</Flex>
			<ScrollToHash />
		</Flex>
	)
}