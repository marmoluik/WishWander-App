import { createContext } from "react";
import { SubscriptionState, defaultSubscriptionState } from "@/types/subscription";

interface SubscriptionContextType {
  subscription: SubscriptionState;
  setSubscription: React.Dispatch<React.SetStateAction<SubscriptionState>>;
}

export const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: defaultSubscriptionState,
  setSubscription: () => {},
});
