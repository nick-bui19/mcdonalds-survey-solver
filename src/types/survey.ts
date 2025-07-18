export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'multiple-choice' | 'text' | 'yes-no' | 'checkbox';
  question: string;
  selector: string;
  responseStrategy: ResponseStrategy;
}

export interface ResponseStrategy {
  type: 'highest-rating' | 'positive-choice' | 'random-positive-text' | 'yes' | 'selected-options';
  value?: string | string[];
  textTemplates?: string[];
}

export interface SurveyPage {
  url: string;
  questions: SurveyQuestion[];
  nextButtonSelector: string;
  isCompletionPage: boolean;
  validationCodeSelector?: string;
}

export interface SurveyFlow {
  entryUrl: string;
  pages: SurveyPage[];
  alternativeEntryMethod?: {
    storeNumberSelector: string;
    dateSelector: string;
    timeSelector: string;
  };
}