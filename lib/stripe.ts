import Stripe from 'stripe';
// Leave the API version to the installed SDK. Pinning an incompatible version
// causes Vercel's TypeScript build to fail before a deployment is created.
export const stripe=process.env.STRIPE_SECRET_KEY?new Stripe(process.env.STRIPE_SECRET_KEY):null;
