import { createContext } from "react";

interface TripContextType {
  tripData: any[];
  setTripData: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CreateTripContext = createContext<TripContextType>({
  tripData: [],
  setTripData: () => {},
});