export interface ReceiptCode {
  code: string;
  formatted: string;
  isValid: boolean;
}

export interface SurveyResult {
  success: boolean;
  validationCode?: string;
  expirationDate?: string;
  error?: string;
  completionTime?: number;
}

export interface SurveyStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  statusMessage: string;
  currentStep?: string;
}

export interface AutomationConfig {
  headless: boolean;
  timeout: number;
  retryAttempts: number;
  delayBetweenActions: number;
}