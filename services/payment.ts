import { initStripe } from "@stripe/stripe-react-native";
import Constants from "expo-constants";

const STRIPE_KEY =
  Constants.expoConfig?.extra?.stripePublishableKey ||
  process.env.STRIPE_PUBLISHABLE_KEY ||
  "";

/**
 * Initialize Stripe with the publishable key. Should be called once on app start.
 */
export const initializeStripe = async (): Promise<void> => {
  if (!STRIPE_KEY) {
    console.warn("Stripe publishable key is missing");
    return;
  }
  await initStripe({ publishableKey: STRIPE_KEY });
};

/**
 * Placeholder to trigger a subscription purchase flow.
 * In a real implementation this would call your backend to create a checkout session
 * or payment sheet and then present it to the user.
 */
export const subscribeUser = async (): Promise<void> => {
  console.log("Launching subscription flow...");
};

/**
 * Placeholder to query backend for current subscription status.
 */
export const checkSubscriptionStatus = async (): Promise<boolean> => {
  return false;
};
