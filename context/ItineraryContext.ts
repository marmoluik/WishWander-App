import { createContext } from "react";

export interface DayPlan {
  day: number;
  date: string;
  schedule: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  food_recommendations: string;
  stay_options: string;
  optional_activities: { name: string; booking_url: string }[];
  travel_tips: string;
}

export interface StoredItinerary {
  id: string;
  title: string;
  plan: DayPlan[];
}

interface ItineraryContextType {
  itineraries: StoredItinerary[];
  addItinerary: (it: StoredItinerary) => void;
}

export const ItineraryContext = createContext<ItineraryContextType>({
  itineraries: [],
  addItinerary: () => {},
});
