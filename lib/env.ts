import { z } from "zod/v4";

const envSchema = z.object({
  // Required
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // Auth - at least one secret required
  AUTH_SECRET: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // Wix
  NEXT_PUBLIC_WIX_CLIENT_ID: z.string().optional(),
  WIX_FEATURED_CATEGORY_ID: z.string().optional(),

  // OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),

  // Push
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Environment validation failed:");
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    throw new Error("Invalid environment variables. Check server logs.");
  }

  // Check that at least one auth secret is set
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    console.warn(
      "Warning: Neither AUTH_SECRET nor NEXTAUTH_SECRET is set. Authentication may not work."
    );
  }

  return result.data;
}

export type Env = z.infer<typeof envSchema>;
