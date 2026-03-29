import { z } from 'zod';

const envSchema = z.object({
  swellStoreId: z.string(),
  swellPublicKey: z.string(),
  baseUrl: z.string(),
  trackingApiKey: z.string().optional().default(''),
});

const unparsedEnv = {
  swellStoreId: process.env.EXPO_PUBLIC_SWELL_STORE_ID,
  swellPublicKey: process.env.EXPO_PUBLIC_SWELL_PUBLIC_KEY,
  baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
  trackingApiKey: process.env.EXPO_PUBLIC_TRACKING_API_KEY,
};

export const env = envSchema.parse(unparsedEnv);
