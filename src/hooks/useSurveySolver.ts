'use client';

import { useState, useCallback } from 'react';
import type { SurveyStatus, SurveyResult } from '@/types';

interface UseSurveySolverReturn {
  status: SurveyStatus;
  result: SurveyResult | null;
  isLoading: boolean;
  isIdle: boolean;
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  solveSurvey: (receiptCode: string) => Promise<void>;
  reset: () => void;
  retry: () => void;
}

export function useSurveySolver(): UseSurveySolverReturn {
  const [status, setStatus] = useState<SurveyStatus>({
    status: 'idle',
    progress: 0,
    statusMessage: '',
  });
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [lastReceiptCode, setLastReceiptCode] = useState<string>('');

  const solveSurvey = useCallback(async (receiptCode: string) => {
    setLastReceiptCode(receiptCode);
    setStatus({
      status: 'processing',
      progress: 0,
      statusMessage: 'Starting survey automation...',
    });
    setResult(null);

    try {
      const response = await fetch('/api/solve-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiptCode }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          status: 'success',
          progress: 100,
          statusMessage: 'Survey completed successfully!',
        });
        setResult(data);
      } else {
        setStatus({
          status: 'error',
          progress: 0,
          statusMessage: data.error || 'Survey failed',
        });
        setResult(data);
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      setStatus({
        status: 'error',
        progress: 0,
        statusMessage: 'Network error occurred',
      });
      setResult({
        success: false,
        error:
          'Unable to connect to the survey service. Please check your internet connection and try again.',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({
      status: 'idle',
      progress: 0,
      statusMessage: '',
    });
    setResult(null);
    setLastReceiptCode('');
  }, []);

  const retry = useCallback(() => {
    if (lastReceiptCode) {
      solveSurvey(lastReceiptCode);
    }
  }, [lastReceiptCode, solveSurvey]);

  return {
    status,
    result,
    isLoading: status.status === 'processing',
    isIdle: status.status === 'idle',
    isProcessing: status.status === 'processing',
    isSuccess: status.status === 'success',
    isError: status.status === 'error',
    solveSurvey,
    reset,
    retry,
  };
}
