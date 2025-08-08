import { z } from "zod";

export const optionalActivitySchema = z.object({
  name: z.string().optional(),
  booking_url: z.string().optional(),
});

export const dayPlanSchema = z.object({
  day: z.number(),
  date: z.string().optional(),
  schedule: z.object({
    morning: z.string().optional(),
    afternoon: z.string().optional(),
    evening: z.string().optional(),
    night: z.string().optional(),
  }),
  food_recommendations: z.string().optional(),
  stay_options: z.string().optional(),
  optional_activities: z.array(optionalActivitySchema).optional(),
  travel_tips: z.string().optional(),
});

export const flightSchema = z.object({
  departure_city: z.string().optional(),
  arrival_city: z.string().optional(),
  departure_date: z.string().optional(),
  arrival_date: z.string().optional(),
  airline: z.string().optional(),
  flight_number: z.string().optional(),
  price: z.string().optional(),
  booking_url: z.string().optional(),
});

export const hotelOptionSchema = z.object({
  name: z.string(),
  booking_url: z.string().optional(),
});

export const placeSchema = z.object({
  name: z.string(),
  booking_url: z.string().optional(),
});

export const tripPlanSchema = z.object({
  flight_details: z.union([flightSchema, z.array(flightSchema)]).optional(),
  hotel: z.object({ options: z.array(hotelOptionSchema).optional() }).optional(),
  places_to_visit: z.array(placeSchema).optional(),
  itinerary: z.array(dayPlanSchema).optional(),
});

export type TripPlan = z.infer<typeof tripPlanSchema>;
export type DayPlan = z.infer<typeof dayPlanSchema>;
export type Flight = z.infer<typeof flightSchema>;
