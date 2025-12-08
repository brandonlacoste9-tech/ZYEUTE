/**
 * 💳 STRIPE INITIALIZATION
 * Centralized Stripe.js initialization for the app
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Log key status for debugging
console.log('Stripe Key Loaded:', !!stripeKey);

if (!stripeKey) {
  console.warn('⚠️ VITE_STRIPE_PUBLISHABLE_KEY not found. Stripe features will be disabled.');
}

// Create Stripe promise (singleton pattern)
export const stripePromise: Promise<Stripe | null> = stripeKey
  ? loadStripe(stripeKey)
  : Promise.resolve(null);

/**
 * Get Stripe instance (await this to use Stripe methods)
 */
export const getStripe = async (): Promise<Stripe | null> => {
  return stripePromise;
};
