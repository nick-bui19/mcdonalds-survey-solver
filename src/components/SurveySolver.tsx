'use client';

import React, { useState } from 'react';
import { ReceiptCodeInput } from './ReceiptCodeInput';
import { SurveyResults } from './SurveyResults';
import { ErrorMessage } from './ErrorMessage';
import { ProgressBar } from './ui/ProgressBar';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { TEST_RECEIPT_CODES, getRandomTestCode } from '@/lib/test-codes';
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
    if (result.success) {
      return <SurveyResults result={result} onNewSurvey={handleNewSurvey} />;
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

  // Show processing state
  if (status.status === 'processing') {
    return (
      <div className="text-center p-8">
        <div className="max-w-md mx-auto">
          {/* Processing Icon */}
          <div className="w-16 h-16 mx-auto mb-6">
            <LoadingSpinner size="lg" />
          </div>

          {/* Status Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Solving Your Survey
          </h2>

          <p className="text-gray-600 mb-6">
            Please wait while we automatically complete your McDonald&apos;s
            survey...
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <ProgressBar
              progress={status.progress}
              showPercentage={true}
              size="lg"
            />
          </div>

          {/* Current Step */}
          <p className="text-sm text-gray-500 mb-6">{status.statusMessage}</p>

          {/* Estimated Time */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Estimated time:</strong> 60-120 seconds
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Do not close this tab while the survey is being processed
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show input form (idle state)
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Get Your Validation Code
          </h2>
          <p className="text-lg text-gray-600">
            Enter your McDonald&apos;s receipt code below and we&apos;ll
            automatically complete the survey to get your validation code for
            the offer.
          </p>
        </div>

        <ReceiptCodeInput
          onSubmit={handleSurveySubmit}
          isLoading={false}
          {...(status.status === 'error' && { error: status.statusMessage })}
        />

        {/* Test Mode (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🧪 Test Mode (Development)
            </h3>
            <p className="text-sm text-blue-800 mb-3">
              Try these fake receipt codes for testing:
            </p>
            <div className="grid gap-2 text-sm">
              {TEST_RECEIPT_CODES.slice(0, 3).map((code, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Auto-fill the test code
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
            <button
              onClick={() => {
                const code = getRandomTestCode();
                const event = new CustomEvent('testCodeSelected', {
                  detail: code,
                });
                window.dispatchEvent(event);
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Use Random Test Code
            </button>
          </div>
        )}

        {/* How it works */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            How it works
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <p className="text-base text-gray-600">
                Enter your 26-digit receipt code
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <p className="text-base text-gray-600">
                We automatically complete the survey
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <p className="text-base text-gray-600">
                Get your validation code instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SurveySolver };
