import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.flightApiKey as string;

export const searchFlights = async (params: Record<string, any>) => {
  // integrate with flight API provider
  return [];
};

export const bookFlight = async (details: Record<string, any>) => {
  return { confirmation: 'pending', ...details };
};

export const monitorFlightStatus = async (bookingId: string) => {
  return { bookingId, status: 'scheduled' };
};

export default { searchFlights, bookFlight, monitorFlightStatus };
