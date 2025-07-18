// Realistic McDonald's receipt code examples for testing
// Format: store_id-register_id-julian_date-time_segment-item_segment-checksum
// These are fake codes for testing purposes only

export const TEST_RECEIPT_CODES = [
  // Example 1: Morning visit (8:30 AM)
  '12345-06001-42515-05100-00125-7',

  // Example 2: Lunch visit (12:15 PM)
  '03963-06002-42515-07350-00089-4',

  // Example 3: Evening visit (6:45 PM)
  '45678-06003-42515-11250-00234-8',

  // Example 4: Late night visit (10:30 PM)
  '78901-06001-42515-13500-00067-2',

  // Example 5: Drive-thru breakfast
  '23456-06004-42515-04800-00156-9',
] as const;

export const TEST_CODES_INFO = {
  '12345-06001-42515-05100-00125-7': {
    store: "McDonald's Downtown",
    time: '8:30 AM',
    order: 'Egg McMuffin Meal',
    expectedValidation: 'BF5M4C',
  },
  '03963-06002-42515-07350-00089-4': {
    store: "McDonald's Highway 101",
    time: '12:15 PM',
    order: 'Big Mac Combo',
    expectedValidation: 'LN8K2P',
  },
  '45678-06003-42515-11250-00234-8': {
    store: "McDonald's Mall Location",
    time: '6:45 PM',
    order: 'Quarter Pounder Deluxe',
    expectedValidation: 'DN4X7Q',
  },
  '78901-06001-42515-13500-00067-2': {
    store: "McDonald's 24hr Location",
    time: '10:30 PM',
    order: 'McFlurry & Fries',
    expectedValidation: 'NT9Y3M',
  },
  '23456-06004-42515-04800-00156-9': {
    store: "McDonald's Express",
    time: '8:00 AM',
    order: 'Hotcakes & Coffee',
    expectedValidation: 'BR2L6N',
  },
} as const;

export function getRandomTestCode(): string {
  const codes = Object.keys(TEST_CODES_INFO);
  const randomIndex = Math.floor(Math.random() * codes.length);
  return codes[randomIndex] || TEST_RECEIPT_CODES[0];
}
