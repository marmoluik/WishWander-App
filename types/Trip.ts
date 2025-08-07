import { BookingInfo } from './Booking';

export interface DayPlan {
  day: number;
  date: string;
  schedule: {
    morning: string;
    afternoon: string;
    evening: string;
    night: string;
  };
  food_recommendations?: string;
  stay_options?: string;
  optional_activities?: { name: string; booking_url: string }[];
  travel_tips?: string;
  bookings?: BookingInfo[];
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget?: number;
  status?: string;
}
