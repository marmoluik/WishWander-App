export interface Booking {
  type: 'flight' | 'hotel' | 'activity';
  name: string;
  booking_url: string;
}

export interface Itinerary {
  id: string;
  destination: string;
  prompt: string;
  createdAt: number;
  flights: Booking[];
  hotels: Booking[];
  activities: Booking[];
  metadata?: Record<string, any>;
}
