export interface Booking {
  type: "flight" | "hotel" | "activity";
  provider: string;
  reference?: string;
  url?: string;
  /** For activity bookings, whether it is indoors */
  indoor?: boolean;
}

export interface Destination {
  city: string;
  country?: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  bookings: Booking[];
  createdAt: number;
  updatedAt: number;
}
