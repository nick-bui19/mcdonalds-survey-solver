'use client';

import React, { useState } from 'react';
import { ReceiptCodeInput } from './ReceiptCodeInput';
import { OfficialCompletionPage } from './OfficialCompletionPage';
import { ErrorMessage } from './ErrorMessage';
import { ProgressBar } from './ui/ProgressBar';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { TEST_RECEIPT_CODES } from '@/lib/test-codes';
import type { SurveyStatus, SurveyResult } from '@/types';

const PROGRESS_STEPS = [
  { message: 'Validating receipt code...', progress: 10 },
  { message: 'Opening survey website...', progress: 25 },
  { message: 'Entering receipt information...', progress: 40 },
  { message: 'Answering survey questions...', progress: 70 },
  { message: 'Retrieving validation code...', progress: 90 },
  { message: 'Survey completed!', progress: 100 },
];

const SurveySolver: React.FC = () => {
  const [status, setStatus] = useState<SurveyStatus>({
    status: 'idle',
    progress: 0,
    statusMessage: '',
  });
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [currentReceiptCode, setCurrentReceiptCode] = useState<string>('');

  const simulateProgress = () => {
    return new Promise<void>(resolve => {
      let stepIndex = 0;

      const updateProgress = () => {
        if (stepIndex < PROGRESS_STEPS.length) {
          const step = PROGRESS_STEPS[stepIndex];
          if (step) {
            setStatus(prev => ({
              ...prev,
              progress: step.progress,
              statusMessage: step.message,
              currentStep: step.message,
            }));
          }

          stepIndex++;
          setTimeout(updateProgress, 1000 + Math.random() * 1000); // 1-2 seconds per step
        } else {
          resolve();
        }
      };

      updateProgress();
    });
  };

  const handleSurveySubmit = async (receiptCode: string) => {
    setCurrentReceiptCode(receiptCode);
    setStatus({
      status: 'processing',
      progress: 0,
      statusMessage: 'Starting survey automation...',
    });
    setResult(null);

    try {
      // Start progress simulation
      const progressPromise = simulateProgress();

      // Make API call
      const response = await fetch('/api/solve-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiptCode }),
      });

      const data = await response.json();

      // Wait for progress simulation to complete
      await progressPromise;

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
  };

  const handleRetry = () => {
    if (currentReceiptCode) {
      handleSurveySubmit(currentReceiptCode);
    }
  };

  const handleReset = () => {
    setStatus({
      status: 'idle',
      progress: 0,
      statusMessage: '',
    });
    setResult(null);
    setCurrentReceiptCode('');
  };

  const handleNewSurvey = () => {
    handleReset();
  };

  // Show results if we have them (success or error)
  if (result) {
    if (result.success && result.validationCode) {
      return (
        <OfficialCompletionPage
          validationCode={result.validationCode}
          onStartOver={handleNewSurvey}
        />
      );
    } else {
      return (
        <ErrorMessage
          error={result.error || 'Survey failed'}
          onRetry={handleRetry}
          onReset={handleReset}
        />
      );
    }
  }

  // Show processing state - McDonald's style
  if (status.status === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {/* Red Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-600"></div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <LoadingSpinner size="lg" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Processing Your Survey
          </h2>

          <p className="text-gray-600 mb-6">
            Please wait while we complete your survey...
          </p>

          <div className="mb-4">
            <ProgressBar
              progress={status.progress}
              showPercentage={true}
              size="lg"
            />
          </div>

          <p className="text-sm text-gray-500 mb-6">{status.statusMessage}</p>

          <p className="text-xs text-gray-500">* Do not close this window</p>
        </div>
      </div>
    );
  }

  // Show input form (idle state) - Simplified Panda Express style
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Red Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-red-600"></div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Automatically Complete your McDonald&apos;s Survey
          </h1>
          <p className="text-gray-600">
            Just enter your code - receive your validation code in seconds!
          </p>
        </div>

        <ReceiptCodeInput
          onSubmit={handleSurveySubmit}
          isLoading={false}
          {...(status.status === 'error' && { error: status.statusMessage })}
        />

        {/* Test Mode (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              🧪 Test Mode
            </h3>
            <div className="grid gap-1 text-xs">
              {TEST_RECEIPT_CODES.slice(0, 3).map((code, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const event = new CustomEvent('testCodeSelected', {
                      detail: code,
                    });
                    window.dispatchEvent(event);
                  }}
                  className="text-left p-2 bg-white rounded border hover:bg-blue-50 font-mono text-blue-700"
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          * Please allow up to 2 minutes for processing
        </p>
      </div>
    </div>
  );
};

export { SurveySolver };
