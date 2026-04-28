import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from 'classnames';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PostHogProvider } from '@/components/PostHogProvider';

import { Footer, Header, RouteGuard } from "@/components";
import { baseURL, effects, style } from '@/app/resources'

import { Inter } from 'next/font/google'
import { Source_Code_Pro } from 'next/font/google';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { routing } from "@/i18n/routing";
import { renderContent } from "@/app/resources";
import { Background, Flex } from "@/once-ui/components";

export async function generateMetadata(
	{ params: { locale }}: { params: { locale: string }}
) {

	const t = await getTranslations();
	const { person, home } = renderContent(t);

	return {
		metadataBase: new URL('https://www.cloudcraftwithfranck.org'),
		title: {
			default: 'Franck Kengne | Principal Cloud & DevSecOps Architect',
			template: '%s | Franck Kengne',
		},
		description: 'Principal Cloud & DevSecOps Architect specializing in Azure Landing Zones, FedRAMP compliance automation, AKS, Platform One, and DoD government cloud infrastructure. Real code. Real automation.',
		keywords: [
			'Principal Cloud Architect', 'Azure Landing Zones', 'FedRAMP automation',
			'NIST 800-53', 'DevSecOps', 'AKS hardening', 'Platform One', 'Big Bang',
			'Chainguard', 'Iron Bank', 'DoD IL4', 'Azure GCC High', 'Bicep IaC',
			'OSCAL', 'Policy as Code', 'government cloud', 'compliance automation',
		],
		authors: [{ name: 'Franck Kengne', url: 'https://www.cloudcraftwithfranck.org' }],
		creator: 'Franck Kengne',
		openGraph: {
			type: 'website',
			locale: 'en_US',
			url: 'https://www.cloudcraftwithfranck.org',
			siteName: 'CloudCraft with Franck',
			title: 'Franck Kengne | Principal Cloud & DevSecOps Architect',
			description: 'Principal Cloud Architect. FedRAMP automation, Azure GCC High, AKS, Platform One, DoD IL4. Real code, real runbooks.',
			images: [{ url: '/og', width: 1200, height: 630, alt: 'Franck Kengne — Principal Cloud Architect' }],
		},
		twitter: {
			card: 'summary_large_image',
			site: '@cloudcwfranck',
			creator: '@cloudcwfranck',
			title: 'Franck Kengne | Principal Cloud & DevSecOps Architect',
			description: 'Principal Cloud Architect. FedRAMP automation, Azure GCC High, AKS, Platform One, DoD IL4.',
			images: ['/og'],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
	}
};

const primary = Inter({
	variable: '--font-primary',
	subsets: ['latin'],
	display: 'swap',
})

type FontConfig = {
    variable: string;
};

/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;
/*
*/

const code = Source_Code_Pro({
	variable: '--font-code',
	subsets: ['latin'],
	display: 'swap',
});

interface RootLayoutProps {
	children: React.ReactNode;
	params: {locale: string};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
  }

export default async function RootLayout({
	children,
	params: {locale}
} : RootLayoutProps) {
	unstable_setRequestLocale(locale);
	const messages = await getMessages();
	return (
		<PostHogProvider>
		<NextIntlClientProvider messages={messages}>
			<Flex
				as="html" lang="en"
				background="page"
				data-neutral={style.neutral} data-brand={style.brand} data-accent={style.accent}
				data-solid={style.solid} data-solid-style={style.solidStyle}
				data-theme={style.theme}
				data-border={style.border}
				data-surface={style.surface}
				data-transition={style.transition}
				className={classNames(
					primary.variable,
					secondary ? secondary.variable : '',
					tertiary ? tertiary.variable : '',
					code.variable)}>
				<Flex style={{minHeight: '100vh'}}
					as="body"
					fillWidth margin="0" padding="0"
					direction="column">
					<Background
						mask={effects.mask as any}
						gradient={effects.gradient as any}
						dots={effects.dots as any}
						lines={effects.lines as any}/>
					<Flex
						fillWidth
						minHeight="16">
					</Flex>
					<Header/>
					<Flex
						zIndex={0}
						fillWidth paddingY="l" paddingX="l"
						justifyContent="center" flex={1}>
						<Flex
							justifyContent="center"
							fillWidth minHeight="0">
							<RouteGuard>
								{children}
							</RouteGuard>
						</Flex>
					</Flex>
					<Footer/>
				</Flex>
			</Flex>
			<Analytics />
			<SpeedInsights />
		</NextIntlClientProvider>
		</PostHogProvider>
	);
}