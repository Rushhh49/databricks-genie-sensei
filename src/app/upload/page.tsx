'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateSession } from '@/components/upload/CreateSession';
import { FileUpload } from '@/components/upload/FileUpload';
import { JobProcessor } from '@/components/upload/JobProcessor';
import { ClarificationForm } from '@/components/upload/ClarificationForm';
import { MouseFollower } from '@/components/effects/MouseFollower';
import { Loader2, Circle } from 'lucide-react'; // Added Circle import
import axios from 'axios';

interface ClarificationItem {
    column_name: string;
    clarifying_question: string;
}

export default function UploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [processState, setProcessState] = useState('awaiting_upload');
    const [runId, setRunId] = useState<string | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [clarificationItems, setClarificationItems] = useState<ClarificationItem[]>([]);
    
    useEffect(() => {
        if (processState === 'processing_job_2' && sessionId) {
            startJob2();
        }
    }, [processState, sessionId]);

    const handleUploadSuccess = async (uploadedFilePath: string) => {
        setError(null);
        setFilePath(uploadedFilePath);
        setProcessState('processing_job_1');
        startJob1(uploadedFilePath);
    };
    
    const startJob1 = async (currentFilePath: string, answers: Record<string, string> = {}) => {
        try {
            const fileType = currentFilePath.split('.').pop() || '';
            const response = await axios.post('/api/jobs/start-processing', { sessionId, filePath: currentFilePath, fileType, answers });
            setRunId(response.data.runId);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to start processing job.');
            setProcessState('awaiting_upload');
        }
    };

    const startJob2 = async () => {
        try {
            const fileType = filePath?.split('.').pop() || '';
            const response = await axios.post('/api/jobs/start-finalization', { sessionId, filePath, fileType });
            setRunId(response.data.runId);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to start finalization job.');
            setProcessState('awaiting_upload');
        }
    };

    const handleJob1Success = async () => {
        setRunId(null);
        setProcessState('checking_clarification');
        try {
            const response = await axios.get(`/api/sessions/${sessionId}/column-statuses`);
            const questionsToAsk = response.data.filter((item: any) => !item.semantic_status);
            if (questionsToAsk.length > 0) {
                setClarificationItems(questionsToAsk);
                setProcessState('awaiting_clarification');
            } else {
                setProcessState('processing_job_2');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to check for clarifications.');
        }
    }

    const handleJob2Success = async () => {
        setProcessState('setting_up_chat'); // New state to show "Setting up..."
        try {
            await axios.post(`/api/sessions/${sessionId}/register-genie-space`);
            const response = await axios.get(`/api/sessions/${sessionId}/semantic-status`);
            const { semantic_status } = response.data;
            if (semantic_status === 'NEEDS_USER_REVIEW') {
                router.push(`/chat?session_id=${sessionId}`);
            } else {
                router.push(`/chat?session_id=${sessionId}`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred during the finalization step.');
            setProcessState('awaiting_upload'); // Go back to start if this final step fails
        }
    };

    const handleJobFailure = (jobError: string) => {
        setError(jobError);
        setProcessState('awaiting_upload');
    }

    const handleClarificationSubmit = (answers: Record<string, string>) => {
        if (!filePath) {
            setError("File path is missing, cannot re-run job.");
            return;
        }
        setProcessState('processing_job_1');
        startJob1(filePath, answers);
    };

    const renderContent = () => {
        if (!sessionId) {
            return <CreateSession />;
        }
        switch(processState) {
            case 'awaiting_upload':
                return <FileUpload sessionId={sessionId} onUploadSuccess={handleUploadSuccess} />;
            case 'processing_job_1':
                return runId ? <JobProcessor runId={runId} jobType="profiling" onJobSuccess={handleJob1Success} onJobFailure={handleJobFailure} /> : null;
            case 'processing_job_2':
                return runId ? <JobProcessor runId={runId} jobType="quality_checks" onJobSuccess={handleJob2Success} onJobFailure={handleJobFailure} /> : null;
            case 'awaiting_clarification':
                return <ClarificationForm items={clarificationItems} onSubmit={handleClarificationSubmit} />;
            case 'checking_clarification':
                 return <div className="text-center text-muted-foreground">Checking for clarifications...</div>;
            case 'setting_up_chat': // New state for setting up chat
                return (
                    <div className="text-center">
                        <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
                        <h2 className="mt-4 text-xl font-semibold">Setting up your Chat Environment...</h2>
                        <p className="mt-2 text-muted-foreground">Almost there!</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="flex h-screen w-full flex-col items-center justify-center p-4">
            <MouseFollower />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-xl shadow-2xl"
            >
                <div className="mb-6 text-center">
                    <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-2">
                        <Circle className="h-8 w-8 text-primary" /> {/* Placeholder Icon */}
                        Sensei
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Awaken your data...</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={processState}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>

                 {error && <p className="text-destructive mt-4 text-center">{error}</p>}

            </motion.div>
        </main>
    );
}
