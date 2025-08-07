import { createFunctionCallModel, defaultGenerationConfig } from '@/config/GeminiConfig';
import {
  fetchCheapestFlights,
  generateHotelLink,
  generatePoiLink,
} from '@/utils/travelpayouts';
import { Booking } from '@/types/itinerary';

// Function declarations exposed to the model for function calling
const functionDeclarations = [
  {
    name: 'searchFlights',
    description: 'Retrieve cheapest flight options',
    parameters: {
      type: 'object',
      properties: {
        origin: { type: 'string' },
        destination: { type: 'string' },
        departDate: { type: 'string', description: 'YYYY-MM-DD' },
      },
      required: ['origin', 'destination', 'departDate'],
    },
  },
  {
    name: 'searchHotels',
    description: 'Generate a hotel booking link for a destination',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        checkIn: { type: 'string', description: 'YYYY-MM-DD' },
        checkOut: { type: 'string', description: 'YYYY-MM-DD' },
      },
      required: ['query'],
    },
  },
  {
    name: 'searchActivities',
    description: 'Generate a booking link for local activities or transfers',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string' },
      },
      required: ['query'],
    },
  },
];

const model = createFunctionCallModel(functionDeclarations);

/**
 * runAgent
 * Basic chat agent that supports function calling. The model may issue
 * functionCalls in its response which are executed locally and fed back
 * to the chat session.
 */
export async function runAgent(prompt: string): Promise<string> {
  const chat = model.startChat({ generationConfig: defaultGenerationConfig });
  let result = await chat.sendMessage(prompt);

  // Loop through function calls until the model returns final text
  while (result.response.functionCalls && result.response.functionCalls.length) {
    for (const call of result.response.functionCalls) {
      const args = call.args ? JSON.parse(call.args) : {};
      let response: any = {};
      if (call.name === 'searchFlights') {
        const flights = await fetchCheapestFlights(
          args.origin,
          args.destination,
          args.departDate
        );
        response = flights.slice(0, 3);
      } else if (call.name === 'searchHotels') {
        const url = generateHotelLink(args.query, args.checkIn, args.checkOut);
        response = { booking_url: url } as Booking;
      } else if (call.name === 'searchActivities') {
        const url = generatePoiLink(args.query);
        response = { booking_url: url } as Booking;
      }
      result = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response,
          },
        },
      ]);
    }
  }

  return result.response.text();
}

export { functionDeclarations };
