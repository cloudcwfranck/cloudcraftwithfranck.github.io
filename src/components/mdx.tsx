import { MDXRemote } from 'next-mdx-remote/rsc';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';
import React, { ReactNode } from 'react';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

import { SmartImage, SmartLink, Text } from '@/once-ui/components';
import { CodeBlock } from '@/once-ui/modules';
import { HeadingLink } from '@/components';
import { EnhancedPre } from '@/components/EnhancedPre';

import { TextProps } from '@/once-ui/interfaces';
import { SmartImageProps } from '@/once-ui/components/SmartImage';

type TableProps = {
    data: {
        headers: string[];
        rows: string[][];
    };
};

function Table({ data }: TableProps) {
    const headers = data.headers.map((header, index) => (
        <th key={index}>{header}</th>
    ));
    const rows = data.rows.map((row, index) => (
        <tr key={index}>
        {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
        ))}
        </tr>
    ));

    return (
        <table>
            <thead>
                <tr>{headers}</tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
    if (href.startsWith('/')) {
        return (
            <SmartLink href={href} {...props}>
                {children}
            </SmartLink>
        );
    }

    if (href.startsWith('#')) {
        return <a href={href} {...props}>{children}</a>;
    }

    return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
        </a>
    );
}

function createImage({ alt, src, ...props }: SmartImageProps & { src: string }) {
    if (!src) {
        console.error("SmartImage requires a valid 'src' property.");
        return null;
    }

    return (
        <SmartImage
            className="my-20"
            enlarge
            radius="m"
            aspectRatio="16 / 9"
            alt={alt}
            src={src}
            {...props}/>
        )
}

function slugify(str: string): string {
    return str
        .toString()
        .toLowerCase()
        .trim() // Remove whitespace from both ends of a string
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    const CustomHeading = ({ children, ...props }: TextProps) => {
    const slug = slugify(children as string);
        return (
            <HeadingLink
                style={{marginTop: 'var(--static-space-24)', marginBottom: 'var(--static-space-12)'}}
                level={level}
                id={slug}
                {...props}>
                {children}
            </HeadingLink>
        );
    };
  
    CustomHeading.displayName = `Heading${level}`;
  
    return CustomHeading;
}

function createParagraph({ children }: TextProps) {
    return (
        <Text style={{lineHeight: '150%'}}
            variant="body-default-m"
            onBackground="neutral-medium"
            marginTop="8"
            marginBottom="12">
            {children}
        </Text>
    );
};

function GfmTable({ children }: { children: ReactNode }) {
    return (
        <div style={{ overflowX: 'auto', marginBlock: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                {children}
            </table>
        </div>
    );
}

function GfmTh({ children }: { children: ReactNode }) {
    return (
        <th style={{
            padding: '8px 16px',
            borderBottom: '2px solid var(--neutral-border-medium)',
            textAlign: 'left',
            fontWeight: 600,
            color: 'var(--neutral-on-background-strong)',
            whiteSpace: 'nowrap',
        }}>
            {children}
        </th>
    );
}

function GfmTd({ children }: { children: ReactNode }) {
    return (
        <td style={{
            padding: '8px 16px',
            borderBottom: '1px solid var(--neutral-border-weak)',
            color: 'var(--neutral-on-background-medium)',
            verticalAlign: 'top',
        }}>
            {children}
        </td>
    );
}

const components = {
    p: createParagraph as any,
    h1: createHeading(1) as any,
    h2: createHeading(2) as any,
    h3: createHeading(3) as any,
    h4: createHeading(4) as any,
    h5: createHeading(5) as any,
    h6: createHeading(6) as any,
    img: createImage as any,
    a: CustomLink as any,
    pre: EnhancedPre as any,
    table: GfmTable as any,
    th: GfmTh as any,
    td: GfmTd as any,
    Table,
    CodeBlock,
};

type CustomMDXProps = MDXRemoteProps & {
    components?: typeof components;
};

const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }] as any,
        [rehypePrettyCode, { theme: 'github-dark' }] as any,
    ],
};

export async function CustomMDX(props: CustomMDXProps) {
    return (
        <MDXRemote
            {...props}
            options={{ mdxOptions, ...(props.options || {}) }}
            components={{ ...components, ...(props.components || {}) }}
        />
    );
}