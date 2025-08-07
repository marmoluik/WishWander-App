import { createContext } from "react";
import { DayPlan } from "@/types/Trip";

export interface StoredItinerary {
  id: string;
  title: string;
  plan: DayPlan[];
}

interface ItineraryContextType {
  itineraries: StoredItinerary[];
  addItinerary: (it: StoredItinerary) => void;
  removeItinerary: (id: string) => void;
}

export const ItineraryContext = createContext<ItineraryContextType>({
  itineraries: [],
  addItinerary: () => {},
  removeItinerary: () => {},
});
