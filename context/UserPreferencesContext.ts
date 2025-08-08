import { createContext } from "react";
import { UserPreferences } from "@/types/user";

interface PrefContextType {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
}

export const UserPreferencesContext = createContext<PrefContextType>({
  preferences: {
    preferredAirlines: [],
    preferredHotels: [],
    dietaryNeeds: [],
    budget: undefined,
    petFriendly: false,
  },
  setPreferences: () => {},
});
