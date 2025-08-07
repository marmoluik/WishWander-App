import { startChatSession } from '@/config/GeminiConfig';
import FirestoreService from './FirestoreService';
import { searchFlights } from './FlightService';
import { searchHotels } from './HotelService';

const AutonomousAgent = {
  handleMessage: async (message: string): Promise<string> => {
    // Placeholder interaction with AI model and services
    void FirestoreService;
    void searchFlights;
    void searchHotels;
    try {
      const session = startChatSession([{ role: 'user', parts: [{ text: message }] }]);
      const result = await session.sendMessage(message);
      const reply = await result.response.text();
      return reply;
    } catch (e) {
      console.error('agent error', e);
      return "I'm having trouble responding right now.";
    }
  },
};

export default AutonomousAgent;
