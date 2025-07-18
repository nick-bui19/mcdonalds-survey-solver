'use client';

import { useState, useCallback } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface UseClipboardReturn {
  copySuccess: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

export function useClipboard(resetTimeout: number = 2000): UseClipboardReturn {
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      const success = await copyToClipboard(text);

      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), resetTimeout);
      }

      return success;
    },
    [resetTimeout]
  );

  const reset = useCallback(() => {
    setCopySuccess(false);
  }, []);

  return {
    copySuccess,
    copy,
    reset,
  };
}
