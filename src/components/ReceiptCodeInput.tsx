'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { validateReceiptCode, parseReceiptCode } from '@/lib/validation';
import { UI_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ReceiptCodeInputProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
  error?: string;
}

const ReceiptCodeInput: React.FC<ReceiptCodeInputProps> = ({
  onSubmit,
  isLoading = false,
  error
}) => {
  const [fields, setFields] = useState<string[]>(Array(UI_CONFIG.INPUT_FIELDS).fill(''));
  const [validationError, setValidationError] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFieldChange = (index: number, value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Determine max length for this field
    const maxLength = index === UI_CONFIG.INPUT_FIELDS - 1 
      ? UI_CONFIG.LAST_FIELD_DIGITS 
      : UI_CONFIG.DIGITS_PER_FIELD;
    
    // Limit to max length
    const limitedValue = digitsOnly.slice(0, maxLength);
    
    // Update the field
    const newFields = [...fields];
    newFields[index] = limitedValue;
    setFields(newFields);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
    
    // Auto-advance to next field if current field is full
    if (limitedValue.length === maxLength && index < UI_CONFIG.INPUT_FIELDS - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to move to previous field
    if (e.key === 'Backspace' && fields[index] === '' && index > 0) {
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digitsOnly = text.replace(/\D/g, '');
      
      if (digitsOnly.length === 26) {
        const parsedFields = parseReceiptCode(digitsOnly);
        setFields(parsedFields);
        
        // Focus the last field
        const lastInput = inputRefs.current[UI_CONFIG.INPUT_FIELDS - 1];
        if (lastInput) {
          lastInput.focus();
        }
      }
    } catch (error) {
      console.warn('Failed to read clipboard:', error);
    }
  };

  const handleSubmit = () => {
    const fullCode = fields.join('');
    const validation = validateReceiptCode(fullCode);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid receipt code');
      return;
    }
    
    onSubmit(validation.formatted || fullCode);
  };

  const isComplete = fields.every((field, index) => {
    const expectedLength = index === UI_CONFIG.INPUT_FIELDS - 1 
      ? UI_CONFIG.LAST_FIELD_DIGITS 
      : UI_CONFIG.DIGITS_PER_FIELD;
    return field.length === expectedLength;
  });

  // Handle Enter key submission
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isComplete && !isLoading) {
        handleSubmit();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [isComplete, isLoading, fields]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Enter your 26-digit McDonald&apos;s receipt code
        </label>
        <div className="flex items-center gap-2 justify-center flex-wrap">
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <Input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                value={field}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'text-center font-mono text-lg',
                  index === UI_CONFIG.INPUT_FIELDS - 1 ? 'w-12' : 'w-20'
                )}
                maxLength={index === UI_CONFIG.INPUT_FIELDS - 1 ? UI_CONFIG.LAST_FIELD_DIGITS : UI_CONFIG.DIGITS_PER_FIELD}
                placeholder={index === UI_CONFIG.INPUT_FIELDS - 1 ? 'X' : 'XXXXX'}
                disabled={isLoading}
                error={!!(validationError || error)}
              />
              {index < UI_CONFIG.INPUT_FIELDS - 1 && (
                <span className="text-gray-400 font-mono text-lg">-</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Format: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x
        </p>
      </div>

      {(validationError || error) && (
        <div className="mb-4 text-center">
          <p className="text-sm text-red-600">
            {validationError || error}
          </p>
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={handleSubmit}
          disabled={!isComplete || isLoading}
          isLoading={isLoading}
          size="lg"
          className="w-full sm:w-auto min-w-48"
        >
          {isLoading ? 'Solving Survey...' : 'Solve Survey'}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handlePaste}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
          disabled={isLoading}
        >
          Paste code from clipboard
        </button>
      </div>
    </div>
  );
};

export { ReceiptCodeInput };