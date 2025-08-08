import { auth, db } from "@/config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { SubscriptionState, defaultSubscriptionState } from "@/types/subscription";

/**
 * Fetch subscription state for the current user from Firestore.
 * Falls back to a default non-premium state when unavailable.
 */
export const fetchSubscriptionState = async (): Promise<SubscriptionState> => {
  if (!auth.currentUser) return defaultSubscriptionState;
  try {
    const ref = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return defaultSubscriptionState;
    const data = snap.data();
    return {
      isPremium: Boolean(data.isPremium),
      entitlements: Array.isArray(data.entitlements) ? data.entitlements : [],
      status: data.subscriptionStatus || "inactive",
    };
  } catch (e) {
    console.warn("fetchSubscriptionState failed", e);
    return defaultSubscriptionState;
  }
};

/**
 * Convenience helper to determine if a given entitlement is present.
 */
export const hasEntitlement = (
  state: SubscriptionState,
  entitlement: string
): boolean => state.entitlements.includes(entitlement);
