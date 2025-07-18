'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { copyToClipboard } from '@/lib/utils';
import type { SurveyResult } from '@/types';

interface SurveyResultsProps {
  result: SurveyResult;
  onNewSurvey: () => void;
}

const SurveyResults: React.FC<SurveyResultsProps> = ({ result, onNewSurvey }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    if (!result.validationCode) return;
    
    const success = await copyToClipboard(result.validationCode);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  if (!result.success) {
    return (
      <div className="text-center p-8">
        <div className="max-w-md mx-auto">
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
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Survey Failed
          </h2>
          
          <p className="text-gray-600 mb-6">
            {result.error || 'Unable to complete the survey. Please try again.'}
          </p>
          
          <div className="space-y-3">
            <Button onClick={onNewSurvey} className="w-full">
              Try Another Code
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.open('https://www.mcdvoice.com/', '_blank')}
              className="w-full"
            >
              Complete Survey Manually
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-8">
      <div className="max-w-md mx-auto">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-green-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Survey Completed!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your McDonald&apos;s survey has been successfully completed. Here&apos;s your validation code:
        </p>

        {/* Validation Code Display */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Validation Code
          </div>
          <div className="text-3xl font-bold font-mono text-red-600 mb-3 tracking-wider">
            {result.validationCode}
          </div>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {copySuccess ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Code
              </>
            )}
          </Button>
        </div>

        {/* Additional Information */}
        <div className="text-left bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Important Information:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Valid for 30 days from today</li>
            <li>• Present this code at any McDonald&apos;s location</li>
            <li>• Code can only be used once</li>
            <li>• Check your receipt for specific offer details</li>
          </ul>
        </div>

        {/* Completion Stats */}
        {result.completionTime && (
          <div className="text-sm text-gray-500 mb-6">
            Survey completed in {Math.round(result.completionTime / 1000)} seconds
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onNewSurvey} className="w-full">
            Solve Another Survey
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Start Over
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>
            This tool is not affiliated with McDonald&apos;s Corporation. 
            Use responsibly and respect the 5-survey monthly limit per location.
          </p>
        </div>
      </div>
    </div>
  );
};

export { SurveyResults };