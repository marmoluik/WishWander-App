export interface SubscriptionState {
  isPremium: boolean;
  entitlements: string[];
  status: "active" | "inactive" | "canceled";
}

export const defaultSubscriptionState: SubscriptionState = {
  isPremium: false,
  entitlements: [],
  status: "inactive",
};
