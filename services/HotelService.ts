import Constants from 'expo-constants';

const apiKey = Constants.expoConfig?.extra?.hotelApiKey as string;

export const searchHotels = async (params: Record<string, any>) => {
  return [];
};

export const bookHotel = async (details: Record<string, any>) => {
  return { confirmation: 'pending', ...details };
};

export default { searchHotels, bookHotel };
