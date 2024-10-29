import { createContext } from "react";

interface TripContextType {
  tripData: any[];
  setTripData: React.Dispatch<React.SetStateAction<any[]>>;
  updateTripData: (newData: any) => void;
}

export const CreateTripContext = createContext<TripContextType>({
  tripData: [],
  setTripData: () => {},
  updateTripData: () => {},
});