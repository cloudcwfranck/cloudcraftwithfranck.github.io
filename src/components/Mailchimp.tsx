"use client";

import { mailchimp } from '@/app/resources'
import { Button, Flex, Heading, Input, Text, Background } from '@/once-ui/components';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

type NewsletterProps = {
    display: boolean;
    title: string | JSX.Element;
    description: string | JSX.Element;
}

export const Mailchimp = (
    { newsletter }: { newsletter: NewsletterProps}
) => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const t = useTranslations();

    const validateEmail = (value: string): boolean => {
        if (value === '') return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (!validateEmail(value)) {
            setError('Please enter a valid email address.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email) || !email) {
            setError('Please enter a valid email address.');
            return;
        }
        setStatus('sending');
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? 'Something went wrong.');
                setStatus('error');
            } else {
                setStatus('success');
            }
        } catch {
            setError('Network error. Please try again.');
            setStatus('error');
        }
    };

    return (
        <Flex
            style={{overflow: 'hidden'}}
            position="relative"
            fillWidth padding="xl" radius="l" marginBottom="m"
            direction="column" alignItems="center" align="center"
            background="surface" border="neutral-medium" borderStyle="solid-1">
            <Background
                position="absolute"
                mask={mailchimp.effects.mask as any}
                gradient={mailchimp.effects.gradient as any}
                dots={mailchimp.effects.dots as any}
                lines={mailchimp.effects.lines as any}/>
            <Heading style={{position: 'relative'}}
                marginBottom="s"
                variant="display-strong-xs">
                {newsletter.title}
            </Heading>
            <Text
                style={{
                    position: 'relative',
                    maxWidth: 'var(--responsive-width-xs)'
                }}
                wrap="balance"
                marginBottom="l"
                onBackground="neutral-medium">
                {newsletter.description}
            </Text>
            {status === 'success' ? (
                <Text style={{position: 'relative'}} onBackground="brand-weak">
                    You're subscribed! Check your inbox for a welcome email.
                </Text>
            ) : (
                <form
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                    onSubmit={handleSubmit}>
                    {/* Honeypot */}
                    <div aria-hidden="true" style={{position: 'absolute', left: '-5000px'}}>
                        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                    </div>
                    <Flex fillWidth maxWidth={24} gap="8">
                        <Input
                            formNoValidate
                            labelAsPlaceholder
                            id="newsletter-email"
                            name="email"
                            type="email"
                            label="Email"
                            required
                            value={email}
                            onChange={handleChange}
                            error={error}/>
                        <Flex height="48" alignItems="center">
                            <Button
                                type="submit"
                                size="m"
                                fillWidth
                                disabled={status === 'sending'}>
                                {status === 'sending' ? 'Subscribing…' : t("newsletter.button")}
                            </Button>
                        </Flex>
                    </Flex>
                </form>
            )}
        </Flex>
    )
}