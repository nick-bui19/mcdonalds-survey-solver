export interface SolveSurveyRequest {
  receiptCode: string;
}

export interface SolveSurveyResponse {
  success: boolean;
  validationCode?: string;
  expirationDate?: string;
  error?: string;
  completionTime?: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}