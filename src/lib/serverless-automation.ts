import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import { SURVEY_CONFIG } from './constants';
import type { SurveyResult } from '@/types';

export class ServerlessSurveyAutomation {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;
  private onProgress?: (message: string, progress: number) => void;

  constructor(onProgress?: (message: string, progress: number) => void) {
    this.onProgress = onProgress;
  }

  private updateProgress(message: string, progress: number) {
    if (this.onProgress) {
      this.onProgress(message, progress);
    }
  }

  async initBrowser(): Promise<void> {
    try {
      this.updateProgress('Initializing browser...', 5);

      // Use chrome-aws-lambda for serverless environments
      this.browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });

      this.page = await this.browser.newPage();

      // Set user agent to look like a real browser
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      this.updateProgress('Browser initialized successfully', 10);
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw new Error('Failed to initialize browser for survey automation');
    }
  }

  async navigateToSurvey(receiptCode: string): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      this.updateProgress('Navigating to survey website...', 15);

      await this.page.goto(SURVEY_CONFIG.BASE_URL, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      this.updateProgress('Entering receipt code...', 25);

      // Wait for the initial form to load
      await this.page.waitForSelector('input[type="text"]', { timeout: 10000 });

      // Enter receipt code parts
      const codeParts = receiptCode.replace(/\D/g, '').match(/.{1,5}/g) || [];

      for (let i = 0; i < codeParts.length && i < 6; i++) {
        const selector = `input[name*="${i + 1}"], input:nth-of-type(${i + 1})`;
        try {
          await this.page.waitForSelector(selector, { timeout: 5000 });
          await this.page.type(selector, codeParts[i] || '');
          await this.page.waitForTimeout(500); // Small delay between inputs
        } catch (error) {
          console.warn(`Could not find input field ${i + 1}:`, error);
        }
      }

      // Submit the initial form
      const submitButton = await this.page.$(
        'input[type="submit"], button[type="submit"]'
      );
      if (submitButton) {
        await submitButton.click();
        await this.page.waitForNavigation({
          waitUntil: 'networkidle2',
          timeout: 10000,
        });
      }

      this.updateProgress('Receipt code entered successfully', 35);
    } catch (error) {
      console.error('Failed to navigate to survey:', error);
      throw new Error("Failed to access McDonald's survey website");
    }
  }

  async completeSurveyQuestions(): Promise<void> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      this.updateProgress('Answering survey questions...', 45);

      let questionCount = 0;
      const maxQuestions = 20; // Safety limit

      while (questionCount < maxQuestions) {
        try {
          // Look for various types of survey inputs
          const radioButtons = await this.page.$$('input[type="radio"]');
          const selectElements = await this.page.$$('select');
          const textInputs = await this.page.$$(
            'input[type="text"]:not([name*="code"])'
          );

          if (radioButtons.length > 0) {
            // For radio buttons, select positive responses (usually the first or highest rating)
            for (const radio of radioButtons.slice(0, 5)) {
              // Limit to prevent infinite loops
              try {
                const value = await radio.evaluate(el =>
                  el.getAttribute('value')
                );
                // Select high satisfaction ratings (5, 4, or "Yes" type responses)
                if (
                  value &&
                  (value === '5' ||
                    value === '4' ||
                    value.toLowerCase().includes('yes'))
                ) {
                  await radio.click();
                  break;
                }
              } catch (e) {
                // Try clicking the first radio button as fallback
                await radioButtons[0].click();
                break;
              }
            }
          }

          if (selectElements.length > 0) {
            // For dropdowns, select positive options
            for (const select of selectElements) {
              await select.select('5'); // Try to select highest rating
            }
          }

          if (textInputs.length > 0) {
            // For text inputs, provide positive feedback
            for (const input of textInputs) {
              await input.type('Great service, thank you!');
            }
          }

          // Look for next/continue button
          const nextButton = await this.page.$(
            'input[value*="Next"], input[value*="Continue"], button:contains("Next"), button:contains("Continue")'
          );
          if (nextButton) {
            await nextButton.click();
            await this.page.waitForTimeout(2000);
            await this.page
              .waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 })
              .catch(() => {});
            questionCount++;
            this.updateProgress(
              `Answered question ${questionCount}...`,
              45 + questionCount * 2
            );
          } else {
            // No more questions, break out of loop
            break;
          }
        } catch (error) {
          console.warn('Error on question', questionCount, ':', error);
          break;
        }
      }

      this.updateProgress('Survey questions completed', 85);
    } catch (error) {
      console.error('Failed to complete survey questions:', error);
      throw new Error('Failed to complete survey questions');
    }
  }

  async extractValidationCode(): Promise<string> {
    if (!this.page) throw new Error('Browser not initialized');

    try {
      this.updateProgress('Retrieving validation code...', 90);

      // Wait for completion page
      await this.page.waitForTimeout(3000);

      // Look for validation code in various possible formats
      const validationSelectors = [
        'text*="Validation Code"',
        'text*="validation code"',
        'text*="Code:"',
        'text*="Your code"',
        '[class*="validation"]',
        '[class*="code"]',
      ];

      let validationCode = '';

      for (const selector of validationSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            const text = await element.evaluate(el => el.textContent || '');
            const codeMatch = text.match(/[A-Z0-9]{6,8}/);
            if (codeMatch) {
              validationCode = codeMatch[0];
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }

      // Fallback: search entire page for validation code pattern
      if (!validationCode) {
        const pageText = await this.page.evaluate(
          () => document.body.textContent || ''
        );
        const codeMatch = pageText.match(
          /(?:validation code|code)[:\s]*([A-Z0-9]{6,8})/i
        );
        if (codeMatch) {
          validationCode = codeMatch[1];
        }
      }

      if (!validationCode) {
        throw new Error('Could not find validation code on completion page');
      }

      this.updateProgress('Validation code retrieved successfully', 100);
      return validationCode;
    } catch (error) {
      console.error('Failed to extract validation code:', error);
      throw new Error('Failed to retrieve validation code from survey');
    }
  }

  async cleanup(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  }

  async solveSurvey(receiptCode: string): Promise<SurveyResult> {
    const startTime = Date.now();

    try {
      await this.initBrowser();
      await this.navigateToSurvey(receiptCode);
      await this.completeSurveyQuestions();
      const validationCode = await this.extractValidationCode();

      const completionTime = Date.now() - startTime;

      return {
        success: true,
        validationCode,
        expirationDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        completionTime,
      };
    } catch (error) {
      console.error('Survey automation failed:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Survey automation failed',
      };
    } finally {
      await this.cleanup();
    }
  }
}
