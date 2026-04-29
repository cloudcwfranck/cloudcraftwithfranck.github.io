"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Flex, Text, Button } from '@/once-ui/components';
import ScoreResult from './ScoreResult';
import styles from '@/styles/academy.module.scss';

type Props = {
    assignmentId: string;
    trackName: string;
    assignmentTitle: string;
    rubric: string[];
    placeholder: string;
};

export default function SubmissionEditor({
    assignmentId,
    trackName,
    assignmentTitle,
    rubric,
    placeholder,
}: Props) {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => setContent((e.target?.result as string) ?? '');
        reader.readAsText(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt', '.bicep', '.kql', '.tf'],
            'application/x-yaml': ['.yaml', '.yml'],
            'application/json': ['.json'],
        },
        maxFiles: 1,
    });

    async function handleSubmit() {
        if (!content.trim()) {
            setError('Please enter or upload your submission.');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignmentId, trackName, assignmentTitle, rubric, submission: content }),
            });
            if (!res.ok) throw new Error('Scoring failed');
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError('Scoring failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    if (result) {
        return (
            <Flex direction="column" gap="24" fillWidth>
                <ScoreResult data={result} />
                <Button
                    variant="tertiary"
                    size="s"
                    label="Submit again"
                    onClick={() => setResult(null)}
                />
            </Flex>
        );
    }

    return (
        <Flex direction="column" gap="16" fillWidth>
            {/* File upload dropzone */}
            <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
                <input {...getInputProps()} />
                <Text variant="body-default-s" onBackground="neutral-weak">
                    {isDragActive
                        ? 'Drop the file here…'
                        : 'Drag & drop a file, or click to browse'}
                </Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">
                    .bicep, .yaml, .json, .tf, .kql, .txt
                </Text>
            </div>

            <Text variant="label-default-s" onBackground="neutral-weak" style={{ textAlign: 'center' }}>
                — or type / paste below —
            </Text>

            <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
            />

            {error && (
                <Text variant="label-default-s" style={{ color: '#ef4444' }}>
                    {error}
                </Text>
            )}

            <Button
                variant="primary"
                size="m"
                label={submitting ? 'Scoring with AI…' : 'Submit for Scoring'}
                onClick={handleSubmit}
                disabled={submitting}
            />
        </Flex>
    );
}
