'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { validateReceiptCode } from '@/lib/validation';

interface ReceiptCodeInputProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
  error?: string;
}

const ReceiptCodeInput: React.FC<ReceiptCodeInputProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [receiptCode, setReceiptCode] = useState('');
  const [validationError, setValidationError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow digits and dashes only
    const formatted = value.replace(/[^0-9-]/g, '');
    setReceiptCode(formatted);

    // Clear validation error when user starts typing
    if (validationError || error) {
      setValidationError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiptCode.trim()) {
      setValidationError('Please enter your receipt code');
      return;
    }

    const validation = validateReceiptCode(receiptCode);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid receipt code format');
      return;
    }

    onSubmit(validation.formatted || receiptCode);
  };

  // Handle test code auto-fill (development only)
  useEffect(() => {
    const handleTestCode = (e: CustomEvent) => {
      const testCode = e.detail;
      setReceiptCode(testCode);
    };

    window.addEventListener(
      'testCodeSelected',
      handleTestCode as EventListener
    );
    return () =>
      window.removeEventListener(
        'testCodeSelected',
        handleTestCode as EventListener
      );
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="receiptCode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Survey Code
        </label>
        <input
          id="receiptCode"
          type="text"
          value={receiptCode}
          onChange={handleChange}
          placeholder="Enter your 26-digit survey code"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-mono"
          disabled={isLoading}
          maxLength={31} // 26 digits + 5 dashes
        />
        <p className="text-xs text-gray-500 mt-1">
          Found at the bottom of your receipt (26 digits)
        </p>
      </div>

      {(validationError || error) && (
        <div className="text-center">
          <p className="text-sm text-red-600">{validationError || error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!receiptCode.trim() || isLoading}
        isLoading={isLoading}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-medium"
      >
        {isLoading ? 'Processing Survey...' : 'Submit Survey'}
      </Button>
    </form>
  );
};

export { ReceiptCodeInput };
