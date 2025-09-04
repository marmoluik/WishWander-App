import AsyncStorage from "@react-native-async-storage/async-storage";
import { logDataAccess } from "@/packages/db/schemas/DataAccessLog";

const KEY = "passportCountry";

export const getPassportCountry = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    logDataAccess({
      id: Date.now().toString(),
      actor: "local-user",
      resource: "passportCountry",
      action: "read",
      timestamp: new Date(),
    });
    return value;
  } catch {
    return null;
  }
};

export const setPassportCountry = async (code: string) => {
  await AsyncStorage.setItem(KEY, code.toUpperCase());
  logDataAccess({
    id: Date.now().toString(),
    actor: "local-user",
    resource: "passportCountry",
    action: "write",
    timestamp: new Date(),
  });
};
