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
      // Initialize and run survey automation for real codes
      console.log('=== REAL CODE PROCESSING ===');
      console.log('Formatted code:', formattedCode);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      console.log('Timestamp:', new Date().toISOString());
      console.log('==============================');

      const automation = new SurveyAutomation();
      const startTime = Date.now();

      try {
        result = await automation.solveSurvey(formattedCode);
        const endTime = Date.now();

        console.log('=== REAL CODE RESULT ===');
        console.log('Success:', result.success);
        console.log('Validation code:', result.validationCode);
        console.log('Processing time (ms):', endTime - startTime);
        console.log('Expiration date:', result.expirationDate);
        if (result.error) console.log('Error:', result.error);
        console.log('Timestamp:', new Date().toISOString());
        console.log('========================');
      } catch (error) {
        console.error('=== AUTOMATION ERROR ===');
        console.error('Code attempted:', formattedCode);
        console.error('Error:', error);
        console.error('Timestamp:', new Date().toISOString());
        console.error('========================');
        throw error;
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
