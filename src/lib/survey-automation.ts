import { chromium, Browser, Page, BrowserContext, Locator } from 'playwright';
import {
  MCDONALDS_SURVEY_CONFIG,
  AUTOMATION_CONFIG,
  SELECTORS,
} from './constants';
import { getRandomResponse } from './response-templates';
import { randomDelay } from './utils';
import type { SurveyResult } from '@/types';

export class SurveyAutomation {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private onProgress?: (message: string, progress: number) => void;

  constructor(onProgress?: (message: string, progress: number) => void) {
    if (onProgress) {
      this.onProgress = onProgress;
    }
  }

  async initialize(): Promise<void> {
    this.updateProgress('Initializing browser...', 5);

    this.browser = await chromium.launch({
      headless: AUTOMATION_CONFIG.HEADLESS,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });

    this.context = await this.browser.newContext({
      viewport: AUTOMATION_CONFIG.VIEWPORT,
      userAgent: AUTOMATION_CONFIG.USER_AGENT,
    });

    this.page = await this.context.newPage();

    // Set realistic timeouts
    this.page.setDefaultNavigationTimeout(AUTOMATION_CONFIG.NAVIGATION_TIMEOUT);
    this.page.setDefaultTimeout(AUTOMATION_CONFIG.NAVIGATION_TIMEOUT);
  }

  async solveSurvey(receiptCode: string): Promise<SurveyResult> {
    const startTime = Date.now();

    try {
      if (!this.page) {
        await this.initialize();
      }

      const formattedCode = this.formatReceiptCode(receiptCode);

      // Navigate to McDonald's survey site
      this.updateProgress('Opening survey website...', 10);
      await this.page!.goto(MCDONALDS_SURVEY_CONFIG.SURVEY_URL, {
        waitUntil: 'networkidle',
      });

      // Wait for page to load and handle any redirects
      await randomDelay(2000, 3000);

      // Enter receipt code
      this.updateProgress('Entering receipt code...', 25);
      await this.enterReceiptCode(formattedCode);

      // Complete survey questions
      this.updateProgress('Answering survey questions...', 40);
      await this.completeSurveyQuestions();

      // Extract validation code
      this.updateProgress('Retrieving validation code...', 90);
      const validationCode = await this.extractValidationCode();

      const completionTime = Date.now() - startTime;
      this.updateProgress('Survey completed successfully!', 100);

      return {
        success: true,
        validationCode,
        expirationDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        completionTime,
      };
    } catch (error) {
      console.error('Survey automation error:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    } finally {
      await this.cleanup();
    }
  }

  private formatReceiptCode(code: string): string[] {
    const digitsOnly = code.replace(/\D/g, '');
    return [
      digitsOnly.slice(0, 5),
      digitsOnly.slice(5, 10),
      digitsOnly.slice(10, 15),
      digitsOnly.slice(15, 20),
      digitsOnly.slice(20, 25),
      digitsOnly.slice(25, 26),
    ];
  }

  private async enterReceiptCode(codeSegments: string[]): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Look for the code input fields
      const codeInputs = await this.page
        .locator('input[name*="CN"], input[id*="code"]')
        .all();

      if (codeInputs.length === 0) {
        // Try alternative selectors
        const altInputs = await this.page.locator('input[type="text"]').all();
        if (altInputs.length >= 6) {
          for (let i = 0; i < Math.min(6, altInputs.length); i++) {
            const input = altInputs[i];
            if (input) {
              await input.fill(codeSegments[i] || '');
              await randomDelay(200, 500);
            }
          }
        } else {
          throw new Error('Could not find receipt code input fields');
        }
      } else {
        // Fill the found code inputs
        for (
          let i = 0;
          i < Math.min(codeSegments.length, codeInputs.length);
          i++
        ) {
          const input = codeInputs[i];
          if (input) {
            await input.fill(codeSegments[i] || '');
            await randomDelay(200, 500);
          }
        }
      }

      // Submit the code
      await randomDelay(1000, 2000);
      const submitButton = this.page.locator(SELECTORS.SUBMIT_BUTTON).first();
      await submitButton.click();

      // Wait for navigation
      await this.page.waitForLoadState('networkidle');
      await randomDelay(2000, 3000);
    } catch (error) {
      throw new Error(`Failed to enter receipt code: ${error}`);
    }
  }

  private async completeSurveyQuestions(): Promise<void> {
    if (!this.page) throw new Error('Page not initialized');

    let questionsAnswered = 0;
    const maxQuestions = 20; // Safety limit

    while (questionsAnswered < maxQuestions) {
      try {
        // Look for rating questions (most common)
        const ratingInputs = await this.page
          .locator('input[type="radio"]')
          .all();

        if (ratingInputs.length > 0) {
          // Answer rating questions with highest satisfaction
          for (const input of ratingInputs) {
            const value = await input.getAttribute('value');
            // Look for highest satisfaction options
            if (
              value === '5' ||
              value === 'Highly Satisfied' ||
              value === 'Excellent'
            ) {
              await input.check();
              await randomDelay(300, 700);
              break;
            }
          }

          // If no specific high-value option found, select the last one (usually highest)
          if (ratingInputs.length > 0) {
            const lastInput = ratingInputs[ratingInputs.length - 1];
            if (lastInput) {
              const isChecked = await lastInput.isChecked();
              if (!isChecked) {
                await lastInput.check();
                await randomDelay(300, 700);
              }
            }
          }
        }

        // Look for text areas and fill with positive responses
        const textAreas = await this.page.locator('textarea').all();
        for (const textArea of textAreas) {
          const response = getRandomResponse('GENERAL_SATISFACTION');
          await textArea.fill(response);
          await randomDelay(500, 1000);
        }

        // Look for select dropdowns
        const selects = await this.page.locator('select').all();
        for (const select of selects) {
          const options = await select.locator('option').all();
          if (options.length > 1) {
            // Select a positive option (usually the last or second-to-last)
            const optionIndex = Math.max(1, options.length - 2);
            await select.selectOption({ index: optionIndex });
            await randomDelay(300, 700);
          }
        }

        // Look for checkboxes and select positive ones
        const checkboxes = await this.page
          .locator('input[type="checkbox"]')
          .all();
        for (const checkbox of checkboxes) {
          const label = await checkbox.locator('..').textContent();
          if (label && this.isPositiveOption(label)) {
            await checkbox.check();
            await randomDelay(300, 700);
          }
        }

        // Find and click Next button
        const nextButton = await this.findNextButton();
        if (nextButton) {
          await randomDelay(1000, 2000);
          await nextButton.click();
          await this.page.waitForLoadState('networkidle');
          await randomDelay(2000, 3000);
          questionsAnswered++;
        } else {
          // No next button found, might be the end
          break;
        }

        // Check if we've reached the validation code page
        const validationCodeExists =
          (await this.page
            .locator('.validation-code, #validationCode, .offer-code')
            .count()) > 0;
        if (validationCodeExists) {
          break;
        }
      } catch (error) {
        console.warn(
          `Error answering question ${questionsAnswered + 1}:`,
          error
        );
        questionsAnswered++;

        // Try to continue anyway
        const nextButton = await this.findNextButton();
        if (nextButton) {
          try {
            await nextButton.click();
            await this.page.waitForLoadState('networkidle');
            await randomDelay(2000, 3000);
          } catch {
            break;
          }
        } else {
          break;
        }
      }
    }
  }

  private async findNextButton(): Promise<Locator | null> {
    if (!this.page) return null;

    // Try multiple selectors for next button
    const selectors = [
      'input[value*="Next"]',
      'button:has-text("Next")',
      'input[type="submit"]',
      'button[type="submit"]',
      '.btn-next',
      '.next-btn',
      'a:has-text("Next")',
    ];

    for (const selector of selectors) {
      try {
        const button = this.page.locator(selector).first();
        if ((await button.count()) > 0 && (await button.isVisible())) {
          return button;
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  private isPositiveOption(text: string): boolean {
    const positiveKeywords = [
      'yes',
      'excellent',
      'great',
      'satisfied',
      'recommend',
      'definitely',
      'likely',
      'clean',
      'fresh',
      'fast',
      'friendly',
    ];

    const lowerText = text.toLowerCase();
    return positiveKeywords.some(keyword => lowerText.includes(keyword));
  }

  private async extractValidationCode(): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');

    try {
      // Wait for validation code to appear
      await this.page.waitForSelector(SELECTORS.VALIDATION_CODE, {
        timeout: 10000,
      });

      const validationElement = this.page
        .locator(SELECTORS.VALIDATION_CODE)
        .first();
      const validationCode = await validationElement.textContent();

      if (!validationCode || validationCode.trim().length === 0) {
        throw new Error('Validation code element found but empty');
      }

      // Clean up the validation code (remove extra spaces, etc.)
      const cleanCode = validationCode.trim().replace(/\s+/g, '');

      if (cleanCode.length < 4) {
        throw new Error('Validation code too short');
      }

      return cleanCode;
    } catch {
      // Try alternative extraction methods
      const pageContent = await this.page.content();

      // Look for common validation code patterns
      const codePatterns = [
        /validation code[:\s]*([A-Z0-9]{4,8})/i,
        /offer code[:\s]*([A-Z0-9]{4,8})/i,
        /code[:\s]*([A-Z0-9]{4,8})/i,
      ];

      for (const pattern of codePatterns) {
        const match = pageContent.match(pattern);
        if (match && match[1]) {
          return match[1].trim();
        }
      }

      throw new Error('Could not extract validation code from page');
    }
  }

  private updateProgress(message: string, progress: number): void {
    if (this.onProgress) {
      this.onProgress(message, progress);
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    } catch {
      console.warn('Error during cleanup');
    }
  }
}
