export const MCDONALDS_SURVEY_CONFIG = {
  SURVEY_URL: 'https://www.mcdvoice.com/',
  CODE_LENGTH: 26,
  CODE_FORMAT: /^\d{5}-\d{5}-\d{5}-\d{5}-\d{5}-\d$/,
  MAX_COMPLETION_TIME: 300000, // 5 minutes
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  DELAY_BETWEEN_ACTIONS: 1000, // 1 second
} as const;

export const UI_CONFIG = {
  COLORS: {
    PRIMARY: '#DA291C', // McDonald's Red
    SECONDARY: '#FFC72C', // McDonald's Yellow
    BACKGROUND: '#FFFFFF',
    TEXT: '#333333',
    SUCCESS: '#10B981',
    ERROR: '#EF4444',
  },
  INPUT_FIELDS: 6,
  DIGITS_PER_FIELD: 5,
  LAST_FIELD_DIGITS: 1,
} as const;

export const AUTOMATION_CONFIG = {
  HEADLESS: true,
  VIEWPORT: { width: 1920, height: 1080 },
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  NAVIGATION_TIMEOUT: 30000,
  ACTION_DELAY: { min: 500, max: 2000 },
} as const;

export const SELECTORS = {
  CODE_INPUT: 'input[name="CN1"], input[id*="code"], input[type="text"]',
  LANGUAGE_SELECT: 'select[name="JavaScriptTest"], #languageSelect',
  SUBMIT_BUTTON: 'input[type="submit"], button[type="submit"], .btn-submit',
  NEXT_BUTTON: 'input[value="Next"], button:contains("Next"), .next-btn',
  RATING_INPUTS: 'input[type="radio"][value="5"], input[type="radio"][value="Highly Satisfied"]',
  VALIDATION_CODE: '.validation-code, #validationCode, .offer-code',
} as const;