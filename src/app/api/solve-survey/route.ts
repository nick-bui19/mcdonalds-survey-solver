import { NextRequest, NextResponse } from 'next/server';
import { validateReceiptCode } from '@/lib/validation';
import { SurveyAutomation } from '@/lib/survey-automation';
import { TEST_CODES_INFO } from '@/lib/test-codes';
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

    if (isTestCode && process.env.NODE_ENV === 'development') {
      // Use mock result for test codes in development
      const testInfo =
        TEST_CODES_INFO[formattedCode as keyof typeof TEST_CODES_INFO];
      console.log('Using test code for:', testInfo.store);

      // Simulate processing time
      await new Promise(resolve =>
        setTimeout(resolve, 3000 + Math.random() * 2000)
      );

      result = {
        success: true,
        validationCode: testInfo.expectedValidation,
        expirationDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        completionTime: 3000 + Math.random() * 2000,
      };
    } else {
      // Initialize and run survey automation for real codes
      const automation = new SurveyAutomation();
      result = await automation.solveSurvey(formattedCode);
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
