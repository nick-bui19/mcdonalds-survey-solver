import React from 'react';
import { Button } from './ui/Button';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onReset?: () => void;
  showManualLink?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onReset,
  showManualLink = true,
}) => {
  return (
    <div className="text-center p-8">
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h2>

        {/* Error Message */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              Try Again
            </Button>
          )}

          {onReset && (
            <Button onClick={onReset} variant="outline" className="w-full">
              Start Over
            </Button>
          )}

          {showManualLink && (
            <Button
              variant="outline"
              onClick={() => window.open('https://www.mcdvoice.com/', '_blank')}
              className="w-full"
            >
              Complete Survey Manually
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-sm text-gray-500">
          <p className="mb-2">Common issues:</p>
          <ul className="text-left space-y-1">
            <li>• Receipt code has expired (valid for 7 days)</li>
            <li>• Code has already been used</li>
            <li>• McDonald&apos;s website is temporarily unavailable</li>
            <li>• Invalid receipt code format</li>
          </ul>
        </div>

        {/* Contact/Support Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            If you continue experiencing issues, try completing the survey
            manually at{' '}
            <a
              href="https://www.mcdvoice.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              mcdvoice.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export { ErrorMessage };
