import * as SecureStore from "expo-secure-store";

const KEY = "passportCountry";

export const getPassportCountry = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
};

export const setPassportCountry = async (code: string) => {
  await SecureStore.setItemAsync(KEY, code.toUpperCase());
};
