export const POSITIVE_RESPONSES = {
  GENERAL_SATISFACTION: [
    'Great experience overall!',
    'Very satisfied with my visit.',
    'Excellent service and food quality.',
    'Always enjoy coming here.',
    'Fast and friendly service.',
    'Food was fresh and delicious.',
    'Clean restaurant and quick service.',
    'Staff was very helpful and polite.',
  ],

  FOOD_QUALITY: [
    'Food was hot and fresh.',
    'Great taste and quality.',
    'Food exceeded my expectations.',
    'Perfectly prepared meal.',
    'Fresh ingredients and great flavor.',
    'Food was exactly what I ordered.',
  ],

  SERVICE_QUALITY: [
    'Staff was friendly and efficient.',
    'Quick and accurate service.',
    'Very professional team.',
    'Helpful and courteous staff.',
    'Service with a smile.',
    'Staff went above and beyond.',
  ],

  CLEANLINESS: [
    'Restaurant was very clean.',
    'Dining area was well-maintained.',
    'Clean facilities throughout.',
    'Spotless and organized.',
  ],

  VALUE: [
    'Great value for the price.',
    'Reasonable prices for quality food.',
    'Good portion sizes.',
    'Fair pricing.',
  ],

  LIKELIHOOD_TO_RETURN: [
    'Definitely will return.',
    'Would recommend to others.',
    'Will be back soon.',
    'Great place to visit.',
  ],

  IMPROVEMENT_SUGGESTIONS: [
    'Everything was perfect.',
    'No suggestions - keep up the great work!',
    'Continue the excellent service.',
    'Everything met my expectations.',
    'No improvements needed.',
  ],
} as const;

export const RATING_RESPONSES = {
  HIGHLY_SATISFIED: 'Highly Satisfied',
  VERY_SATISFIED: 'Very Satisfied',
  EXCELLENT: 'Excellent',
  FIVE_STARS: '5',
  YES: 'Yes',
  DEFINITELY: 'Definitely',
} as const;

export function getRandomResponse(
  category: keyof typeof POSITIVE_RESPONSES
): string {
  const responses = POSITIVE_RESPONSES[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex] || responses[0] || 'Great experience!';
}
