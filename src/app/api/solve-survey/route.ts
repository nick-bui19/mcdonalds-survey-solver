import { NextRequest, NextResponse } from 'next/server';
import { validateReceiptCode } from '@/lib/validation';
import { TEST_CODES_INFO } from '@/lib/test-codes';
import { SurveyAutomation } from '@/lib/survey-automation';
import type { SolveSurveyRequest, SolveSurveyResponse } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: SolveSurveyRequest = await request.json();
    const { receiptCode } = body;

    // Validate the receipt code
    const validation = validateReceiptCode(receiptCode);
    if (!validation.isValid) {
      const errorResponse: SolveSurveyResponse = {
        success: false,
        error: validation.error || 'Invalid receipt code',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    console.log('Processing survey for code:', validation.formatted);

    // Check if this is a test code for development
    const formattedCode = validation.formatted || receiptCode;
    const isTestCode = formattedCode in TEST_CODES_INFO;

    let result;

    if (isTestCode) {
      // Use mock result for test codes (works in all environments for demo)
      const testInfo =
        TEST_CODES_INFO[formattedCode as keyof typeof TEST_CODES_INFO];

      console.log('=== TEST CODE PROCESSING ===');
      console.log('Formatted code:', formattedCode);
      console.log('Is test code:', isTestCode);
      console.log('Test info found:', testInfo);
      console.log('Expected validation:', testInfo?.expectedValidation);
      console.log('Store:', testInfo?.store);
      console.log('NODE_ENV:', process.env.NODE_ENV);

      if (!testInfo) {
        console.error('No test info found for code:', formattedCode);
        throw new Error(
          `Test code ${formattedCode} not found in TEST_CODES_INFO`
        );
      }

      // Simulate processing time
      const processingTime = 3000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));

      result = {
        success: true,
        validationCode: testInfo.expectedValidation,
        expirationDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        completionTime: processingTime,
      };

      console.log('=== TEST RESULT ===');
      console.log('Validation code being returned:', result.validationCode);
      console.log('===================');
    } else {
      // Real codes - use actual automation
      console.log('=== REAL CODE PROCESSING ===');
      console.log('Formatted code:', formattedCode);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('Timestamp:', new Date().toISOString());
      console.log('==============================');

      // Check if we're in a container environment where Playwright should work
      const isContainerEnv =
        process.env.RAILWAY_ENVIRONMENT_NAME ||
        process.env.RENDER ||
        process.env.DOCKER;

      if (!isContainerEnv) {
        console.log(
          'Not in container environment, falling back to manual instruction'
        );
        result = {
          success: false,
          error: `❌ Real receipt codes are not supported on Vercel's serverless platform due to browser automation limitations. Vercel functions cannot run Playwright/Chrome browsers required for McDonald's survey automation. Please use the demo test codes above or visit mcdvoice.com manually with code: ${formattedCode}`,
        };
      } else {
        const automation = new SurveyAutomation();

        try {
          console.log('Initializing Playwright in container...');
          await automation.initialize();

          console.log('Starting survey automation...');
          const automationResult = await automation.solveSurvey(formattedCode);

          if (automationResult.success) {
            result = {
              success: true,
              validationCode: automationResult.validationCode,
              expirationDate: automationResult.expirationDate,
              completionTime: automationResult.completionTime,
            };
          } else {
            result = {
              success: false,
              error: automationResult.error || 'Survey automation failed',
            };
          }
        } catch (error) {
          console.error('Automation error:', error);
          result = {
            success: false,
            error: `Survey automation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or visit mcdvoice.com manually.`,
          };
        } finally {
          await automation.cleanup();
        }
      }
    }

    const response: SolveSurveyResponse = {
      success: result.success,
      ...(result.validationCode && { validationCode: result.validationCode }),
      ...(result.expirationDate && { expirationDate: result.expirationDate }),
      ...(result.error && { error: result.error }),
      ...(result.completionTime && { completionTime: result.completionTime }),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Survey solving error:', error);

    const errorResponse: SolveSurveyResponse = {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Survey solver API is running' },
    { status: 200 }
  );
}
