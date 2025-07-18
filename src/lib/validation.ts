import { MCDONALDS_SURVEY_CONFIG } from './constants';

export function validateReceiptCode(code: string): {
  isValid: boolean;
  error?: string;
  formatted?: string;
} {
  if (!code) {
    return { isValid: false, error: 'Receipt code is required' };
  }

  // Remove all non-digit characters
  const digitsOnly = code.replace(/\D/g, '');

  // Check length
  if (digitsOnly.length !== MCDONALDS_SURVEY_CONFIG.CODE_LENGTH) {
    return {
      isValid: false,
      error: `Receipt code must be exactly ${MCDONALDS_SURVEY_CONFIG.CODE_LENGTH} digits`,
    };
  }

  // Format the code
  const formatted = formatReceiptCode(digitsOnly);

  // Validate format
  if (!MCDONALDS_SURVEY_CONFIG.CODE_FORMAT.test(formatted)) {
    return { isValid: false, error: 'Invalid receipt code format' };
  }

  return { isValid: true, formatted };
}

export function formatReceiptCode(code: string): string {
  const digitsOnly = code.replace(/\D/g, '');

  if (digitsOnly.length !== MCDONALDS_SURVEY_CONFIG.CODE_LENGTH) {
    return code; // Return as-is if not the right length
  }

  // Format as: xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x
  return `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 10)}-${digitsOnly.slice(10, 15)}-${digitsOnly.slice(15, 20)}-${digitsOnly.slice(20, 25)}-${digitsOnly.slice(25, 26)}`;
}

export function parseReceiptCode(formattedCode: string): string[] {
  const digitsOnly = formattedCode.replace(/\D/g, '');

  return [
    digitsOnly.slice(0, 5),
    digitsOnly.slice(5, 10),
    digitsOnly.slice(10, 15),
    digitsOnly.slice(15, 20),
    digitsOnly.slice(20, 25),
    digitsOnly.slice(25, 26),
  ];
}

export function isValidationCodeValid(code: string): boolean {
  // Basic validation for McDonald's validation codes
  // They are typically 4-6 digit alphanumeric codes
  return /^[A-Z0-9]{4,6}$/i.test(code.trim());
}
