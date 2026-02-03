export const wixClientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
export const wixFeaturedCategoryId = process.env.WIX_FEATURED_CATEGORY_ID;

// Correct, conventional Auth.js / Google env names
export const googleClientId = process.env.GOOGLE_CLIENT_ID;
export const googleSecret = process.env.GOOGLE_CLIENT_SECRET;

// Support standard secret names used by Auth.js / NextAuth
export const nextAuthSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

export const mongoUri = process.env.MONGODB_URI;
export const githubId = process.env.GITHUB_ID;
export const githubSecret = process.env.GITHUB_SECRET;

// Email (Phase 3)
export const gmailUser = process.env.GMAIL_USER;
export const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

// Stripe webhook (Phase 3)
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Push notifications (Phase 4)
export const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
export const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
