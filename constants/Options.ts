export const travelerOptions = [
  {
    id: 1,
    title: "Solo",
    description: "Perfect for a journey of self-discovery",
    icon: "person",
    people: "1 person"
  },
  {
    id: 2,
    title: "Couple",
    description: "Ideal for romantic getaways",
    icon: "people",
    people: "2 people"
  },
  {
    id: 3,
    title: "Family",
    description: "Create memories with your loved ones",
    icon: "family-restroom",
    people: "3-5 people"
  },
  {
    id: 4,
    title: "Friends",
    description: "Adventure with your squad",
    icon: "people-circle",
    people: "4+ people"
  }
];

export const budgetOptions = [
  {
    id: 1,
    title: "Cheap",
    description: "Perfect for a budget-friendly trip",
    icon:'💵'
  },
  {
    id: 2,
    title: "Moderate",
    description: "Keep it balanced",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    description: "Go all out",
    icon: "💸",
  },
];

export const AI_PROMPT = `Return only JSON. Generate a trip plan for Location "{location}" lasting {totalDays} day(s) and {totalNights} night(s) for {travelers} with a {budget} budget.

Use this exact schema:
{
  "trip_plan": {
    "location": "{location}",
    "duration": "{totalDays} days and {totalNights} nights",
    "group_size": "{travelers}",
    "budget": "{budget}",
    "flight_details": {
      "departure_city": "",
      "arrival_city": "",
      "departure_date": "",
      "departure_time": "",
      "arrival_date": "",
      "arrival_time": "",
      "airline": "",
      "flight_number": "",
      "price": "",
      "booking_url": ""
    },
    "hotel": {
      "options": [
        {
          "name": "",
          "address": "",
          "price": "",
          "image_url": "",
          "geo_coordinates": { "latitude": 0, "longitude": 0 },
          "rating": "",
          "description": ""
        }
      ]
    },
    "places_to_visit": [
      {
        "name": "",
        "details": "",
        "image_url": "",
        "geo_coordinates": { "latitude": 0, "longitude": 0 },
        "ticket_price": "",
        "time_to_travel": "",
        "categories": []
      }
    ]
  }
}`;

export const interestCategories = [
  "Nature",
  "Culture",
  "Adventure",
  "Relaxation",
  "Food & Drink",
];
