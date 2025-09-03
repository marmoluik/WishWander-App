import {
  flightProvider,
  hotelProvider,
  activityProvider,
} from "@/packages/providers/registry";
import type { FlightOffer } from "@/packages/providers/types";
import * as Notifications from "expo-notifications";
import {
  evaluatePolicy,
  PolicyEvaluationRequest,
} from "../packages/agent/policies";
import { logDecision } from "../packages/db/schemas/DecisionLog";
import {
  addPendingAction,
  PendingAction,
} from "../packages/db/schemas/PendingAction";

/**
 * Function declarations exposed to the LLM for structured function calling.
 * These are consumed by the Gemini SDK when starting a chat session.
 */
export const functionDeclarations = [
  {
    name: "search_flights",
    description: "Find cheapest flight offers between two IATA airport codes",
    parameters: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin airport IATA code" },
        destination: {
          type: "string",
          description: "Destination airport IATA code",
        },
        departDate: {
          type: "string",
          description: "Departure date in YYYY-MM-DD format",
        },
      },
      required: ["origin", "destination", "departDate"],
    },
  },
  {
    name: "hotel_link",
    description: "Create an affiliate booking link for hotels at a destination",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Destination name" },
        checkIn: { type: "string", description: "Check in date" },
        checkOut: { type: "string", description: "Check out date" },
      },
      required: ["query"],
    },
  },
  {
    name: "activity_link",
    description: "Create an affiliate booking link for activities or transfers",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Activity description, e.g. 'Lisbon walking tour'",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "find_nearby",
    description:
      "Find nearby points of interest given a kind, time and radius in km",
    parameters: {
      type: "object",
      properties: {
        kind: { type: "string", description: "Type of place e.g. restaurant" },
        when: {
          type: "string",
          description: "Desired time, e.g. 19:00 or 'now'",
        },
        radius: {
          type: "number",
          description: "Search radius in kilometers",
        },
      },
      required: ["kind"],
    },
  },
  {
    name: "book_restaurant",
    description: "Book a restaurant table respecting policy guardrails",
    parameters: {
      type: "object",
      properties: {
        restaurantId: { type: "string" },
        time: { type: "string" },
        cost: { type: "number" },
        brand: { type: "string" },
        tripTotal: { type: "number" },
      },
      required: ["restaurantId", "time", "cost"],
    },
  },
  {
    name: "insert_into_plan",
    description: "Insert an activity into the active itinerary plan",
    parameters: {
      type: "object",
      properties: {
        day: { type: "number" },
        timeSlot: {
          type: "string",
          description: "One of morning, afternoon, evening, night",
        },
        activityId: { type: "string" },
        activityName: { type: "string" },
      },
      required: ["day", "timeSlot", "activityId"],
    },
  },
  {
    name: "confirm_booking",
    description: "Confirm a booking after evaluating policy guardrails",
    parameters: {
      type: "object",
      properties: {
        cost: { type: "number", description: "Cost of the booking" },
        departureTime: {
          type: "string",
          description: "ISO departure time, if applicable",
        },
        brand: { type: "string", description: "Airline or hotel brand" },
        tripTotal: {
          type: "number",
          description: "Current cumulative trip cost",
        },
      },
      required: ["cost"],
    },
  },
];

export type TravelFunctionName =
  | "search_flights"
  | "hotel_link"
  | "activity_link"
  | "find_nearby"
  | "book_restaurant"
  | "insert_into_plan"
  | "confirm_booking";

// simple in-memory itinerary used by insert_into_plan
const activeItinerary: Record<number, Record<string, string | null>> = {};

export const executeAgentFunction = async (
  name: TravelFunctionName,
  args: any
): Promise<any> => {
  switch (name) {
    case "search_flights": {
      const { origin, destination, departDate } = args;
      const flights: FlightOffer[] = await flightProvider.search({
        origin,
        destination,
        departDate,
      });
      return flights;
    }
    case "hotel_link": {
      const { query, checkIn, checkOut } = args;
      return {
        url: hotelProvider.getSearchUrl({ query, checkIn, checkOut }),
      };
    }
    case "activity_link": {
      const { query } = args;
      return { url: activityProvider.getSearchUrl({ query }) };
    }
    case "find_nearby": {
      const { kind, radius = 1 } = args;
      // simple mock implementation returning a couple of nearby spots
      return [
        { id: "1", name: `${kind} option A`, distance: radius / 2 },
        { id: "2", name: `${kind} option B`, distance: radius * 0.8 },
      ];
    }
    case "book_restaurant": {
      const { cost, brand, tripTotal } = args;
      if (typeof cost === "number" && cost < 30) {
        return { status: "booked" };
      }
      const decision = evaluatePolicy({ cost, brand, tripTotal });
      if (decision.allowed && !decision.requiresHuman) {
        return { status: "booked" };
      }
      if (decision.requiresHuman) {
        const entry: PendingAction = {
          id: Date.now().toString(),
          action: "book_restaurant",
          reason: decision.reason || "Needs human review",
          policyDeltas: decision.deltas,
          payload: args,
          status: "pending",
          createdAt: new Date(),
        };
        addPendingAction(entry);
        return { status: "pending_human", reason: decision.reason };
      }
      return { status: "needs_confirmation", reason: decision.reason };
    }
    case "insert_into_plan": {
      const { day, timeSlot, activityId, activityName } = args;
      if (!activeItinerary[day]) {
        activeItinerary[day] = { morning: null, afternoon: null, evening: null, night: null };
      }
      const slots: (keyof typeof activeItinerary[number])[] = [
        "morning",
        "afternoon",
        "evening",
        "night",
      ];
      let chosenSlot = timeSlot as keyof typeof activeItinerary[number];
      if (activeItinerary[day][chosenSlot]) {
        const idx = slots.indexOf(chosenSlot);
        chosenSlot = slots.slice(idx + 1).find((s) => !activeItinerary[day][s])!;
      }
      if (!chosenSlot) {
        return { status: "no_slot" };
      }
      activeItinerary[day][chosenSlot] = activityId;
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Itinerary updated",
            body: `${activityName || activityId} added to day ${day} (${chosenSlot})`,
          },
          trigger: null,
        });
      } catch {}
      return { status: "scheduled", slot: chosenSlot };
    }
    case "confirm_booking": {
      const request: PolicyEvaluationRequest = {
        cost: args.cost,
        departureTime: args.departureTime,
        brand: args.brand,
        tripTotal: args.tripTotal,
      };
      const decision = evaluatePolicy(request);
      logDecision({
        id: Date.now().toString(),
        action: "confirm_booking",
        allowed: decision.allowed,
        rationale: decision.reason || "",
        timestamp: new Date(),
        payload: args,
      });
      if (decision.allowed && !decision.requiresHuman) {
        return { status: "confirmed" };
      }
      if (decision.requiresHuman) {
        const entry: PendingAction = {
          id: Date.now().toString(),
          action: "confirm_booking",
          reason: decision.reason || "Needs human review",
          policyDeltas: decision.deltas,
          payload: args,
          status: "pending",
          createdAt: new Date(),
        };
        addPendingAction(entry);
        return { status: "pending_human", reason: decision.reason };
      }
      return { status: "needs_confirmation", reason: decision.reason };
    }
    default:
      throw new Error(`Unknown function ${name}`);
  }
};
