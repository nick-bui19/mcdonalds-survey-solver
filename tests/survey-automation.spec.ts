import { test, expect } from '@playwright/test';

test.describe('Survey Automation', () => {
  test('should have working API endpoint', async ({ request }) => {
    const response = await request.get('/api/solve-survey');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.message).toBe('Survey solver API is running');
  });

  test('should validate receipt codes', async ({ request }) => {
    // Test invalid code
    const invalidResponse = await request.post('/api/solve-survey', {
      data: { receiptCode: '123' },
    });
    expect(invalidResponse.status()).toBe(400);

    const invalidData = await invalidResponse.json();
    expect(invalidData.success).toBe(false);
    expect(invalidData.error).toContain('26 digits');
  });

  test('should accept valid receipt code format', async ({ request }) => {
    // Note: This is a mock test with a fake but valid-format code
    const mockCode = '12345-67890-12345-67890-12345-6';

    const response = await request.post('/api/solve-survey', {
      data: { receiptCode: mockCode },
    });

    // Should not be a validation error (might fail on actual survey automation)
    expect(response.status()).not.toBe(400);
  });
});

test.describe('Receipt Code Input Component', () => {
  test('should render receipt code input fields', async ({ page }) => {
    await page.goto('/');

    // Check if the main heading is present
    await expect(page.locator('h1')).toContainText("McDonald's Survey Solver");

    // Check if input fields are present
    const inputs = page.locator('input[type="text"]');
    await expect(inputs).toHaveCount(6);

    // Check if submit button is present
    await expect(
      page.locator('button', { hasText: 'Solve Survey' })
    ).toBeVisible();
  });

  test('should handle code input and validation', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input[type="text"]');

    // Fill in a valid receipt code
    await inputs.nth(0).fill('12345');
    await inputs.nth(1).fill('67890');
    await inputs.nth(2).fill('12345');
    await inputs.nth(3).fill('67890');
    await inputs.nth(4).fill('12345');
    await inputs.nth(5).fill('6');

    // Submit button should be enabled
    const submitButton = page.locator('button', { hasText: 'Solve Survey' });
    await expect(submitButton).toBeEnabled();
  });

  test('should show validation error for invalid code', async ({ page }) => {
    await page.goto('/');

    const inputs = page.locator('input[type="text"]');

    // Fill in an incomplete code
    await inputs.nth(0).fill('123');

    const submitButton = page.locator('button', { hasText: 'Solve Survey' });
    await expect(submitButton).toBeDisabled();
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if the page renders properly on mobile
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();

    // Check if inputs are properly sized for mobile
    const input = page.locator('input[type="text"]').first();
    const inputBox = await input.boundingBox();
    expect(inputBox?.width).toBeGreaterThan(30); // Should be touch-friendly
  });
});

test.describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Mock network failure
    await page.route('/api/solve-survey', route => {
      route.abort();
    });

    const inputs = page.locator('input[type="text"]');

    // Fill in a valid code
    await inputs.nth(0).fill('12345');
    await inputs.nth(1).fill('67890');
    await inputs.nth(2).fill('12345');
    await inputs.nth(3).fill('67890');
    await inputs.nth(4).fill('12345');
    await inputs.nth(5).fill('6');

    // Click submit
    await page.locator('button', { hasText: 'Solve Survey' }).click();

    // Should show error message
    await expect(
      page.locator('text=network error', { timeout: 10000 })
    ).toBeVisible();
  });
});
