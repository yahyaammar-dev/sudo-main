export const extraKeyFactory = {
  banners: 'banners',
  banking: 'banking',
  protection: 'protection',
  tracking: (tracking_number: string) => ['tracking', tracking_number],
  estimatedShipping: (userId: string) => ['estimated-shipping', userId],
} as const;
