'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface JobProcessorProps {
  runId: string;
  jobType: 'profiling' | 'quality_checks';
  onJobSuccess: () => void;
  onJobFailure: (error: string) => void;
}

enum RunLifeCycleState {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  TERMINATING = 'TERMINATING',
  TERMINATED = 'TERMINATED',
  SKIPPED = 'SKIPPED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

enum RunResultState {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEDOUT = 'TIMEDOUT',
  CANCELED = 'CANCELED',
}

const POLLING_INTERVAL = 3000; // 3 seconds


export function JobProcessor({ runId, jobType, onJobSuccess, onJobFailure }: JobProcessorProps) {
  const [status, setStatus] = useState<RunLifeCycleState>(RunLifeCycleState.PENDING);

  useEffect(() => {
    if (!runId) return;

    const pollStatus = async () => {
      try {
        const response = await axios.get(`/api/jobs/status/${runId}`);
        const { life_cycle_state, result_state } = response.data;

        setStatus(life_cycle_state);

        if (life_cycle_state === RunLifeCycleState.TERMINATED) {
          if (result_state === RunResultState.SUCCESS) {
            onJobSuccess();
          } else {
            onJobFailure(`Job failed with result: ${result_state || 'UNKNOWN'}`);
          }
          return;
        }

        if (
          life_cycle_state === RunLifeCycleState.INTERNAL_ERROR ||
          life_cycle_state === RunLifeCycleState.SKIPPED
        ) {
          onJobFailure(`Job failed with state: ${life_cycle_state}`);
          return;
        }

        setTimeout(pollStatus, POLLING_INTERVAL);

      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Failed to get job status.';
        onJobFailure(errorMessage);
      }
    };

    const timeoutId = setTimeout(pollStatus, POLLING_INTERVAL);
    return () => clearTimeout(timeoutId);
  }, [runId, onJobSuccess, onJobFailure]);

  const getStatusText = () => {
    const profilingTexts = {
        [RunLifeCycleState.PENDING]: "Job is pending...",
        [RunLifeCycleState.RUNNING]: "Conducting Semantic Profiling...",
        [RunLifeCycleState.TERMINATING]: "Finalizing profiling...",
        [RunLifeCycleState.TERMINATED]: "Profiling complete.",
        [RunLifeCycleState.SKIPPED]: "Job was skipped.",
        [RunLifeCycleState.INTERNAL_ERROR]: "An internal error occurred.",
    };

    const qualityCheckTexts = {
        [RunLifeCycleState.PENDING]: "Job is pending...",
        [RunLifeCycleState.RUNNING]: "Conducting Data Quality Checks...",
        [RunLifeCycleState.TERMINATING]: "Finalizing checks...",
        [RunLifeCycleState.TERMINATED]: "Checks complete.",
        [RunLifeCycleState.SKIPPED]: "Job was skipped.",
        [RunLifeCycleState.INTERNAL_ERROR]: "An internal error occurred.",
    };
    
    const texts = jobType === 'profiling' ? profilingTexts : qualityCheckTexts;
    return texts[status] || "Checking status...";
  }

  return (
    <div className="text-center">
        <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
        <h2 className="mt-4 text-xl font-semibold">{getStatusText()}</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we process your dataset.</p>
    </div>
  );
}
