import { createContext } from "react";

export interface ActivitySlot {
  /** Title or brief description of the activity */
  name: string;
  /** Whether the activity takes place indoors */
  indoor: boolean;
}

export interface DayPlan {
  day: number;
  date: string;
  schedule: {
    morning?: ActivitySlot;
    afternoon?: ActivitySlot;
    evening?: ActivitySlot;
    night?: ActivitySlot;
  };
  /** Optional weather-based suggestion for this day */
  weatherSuggestion?: string;
  food_recommendations: string;
  stay_options: string;
  optional_activities: { name: string; booking_url: string }[];
  travel_tips: string;
}

export interface StoredItinerary {
  id: string;
  /** Identifier for the trip this itinerary belongs to */
  tripId: string;
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
