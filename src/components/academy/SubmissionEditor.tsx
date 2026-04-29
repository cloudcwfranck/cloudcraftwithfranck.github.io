'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ScoreResult from './ScoreResult';

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
        } catch {
            setError('Scoring failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    if (result) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
                <ScoreResult data={result} />
                <button
                    onClick={() => setResult(null)}
                    style={{
                        background: 'none',
                        border: '1px solid var(--neutral-border-medium, #333)',
                        color: 'var(--neutral-on-background-weak, #888)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        alignSelf: 'flex-start',
                    }}
                >
                    Submit again
                </button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                style={{
                    border: `2px dashed ${isDragActive ? 'var(--brand-border-strong, #3b82f6)' : 'var(--neutral-border-medium, #333)'}`,
                    borderRadius: '10px',
                    padding: '32px 24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragActive ? 'rgba(59,130,246,0.05)' : 'transparent',
                    transition: 'all 0.2s',
                }}
            >
                <input {...getInputProps()} />
                <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                    {isDragActive ? 'Drop the file here…' : 'Drag & drop a file, or click to browse'}
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--neutral-on-background-weak, #888)' }}>
                    .bicep, .yaml, .json, .tf, .kql, .txt
                </p>
            </div>

            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--neutral-on-background-weak, #888)', textAlign: 'center' }}>
                — or type / paste below —
            </p>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                spellCheck={false}
                style={{
                    width: '100%',
                    minHeight: '280px',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--neutral-border-medium, #333)',
                    background: 'var(--neutral-background-strong, #111)',
                    color: 'var(--neutral-on-background-strong, #f0f0f0)',
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font-code, monospace)',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                }}
            />

            {error && (
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#ef4444' }}>{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: submitting ? 'var(--neutral-border-medium, #444)' : 'var(--brand-background-strong, #3b82f6)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                }}
            >
                {submitting ? 'Scoring with AI…' : 'Submit for Scoring'}
            </button>
        </div>
    );
}
