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

export const AI_PROMPT = "Generate a trip plan for the following data: Location - {location}. {totalDays} Day(s) and {totalNights} Night(s), for a group size of {travelers}, with a {budget} Budget. Include Flight Details, Flight Price with Booking URL, a list of hotel options with Hotel Name, Hotel Address, Price, Hotel Image URL, Geo Coordinates, Rating, Description, and Places to visit nearby with Place Name, Place Details, Place Image URL, Geo Coordinates, Ticket Price, Time to Travel to each of the location. Make sure you give this plan in JSON format.";
