import AsyncStorage from "@react-native-async-storage/async-storage";

// Attempt to load expo-secure-store. If it's unavailable (e.g., when running in
// an environment where the native module isn't installed) fall back to
// AsyncStorage. Using a variable for require avoids Metro from failing to
// resolve the module when it's not present.
let secureStore: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  secureStore = require("expo-secure-store");
} catch {
  secureStore = null;
}

export const getItemAsync = async (key: string) => {
  if (secureStore?.getItemAsync) {
    return secureStore.getItemAsync(key);
  }
  return AsyncStorage.getItem(key);
};

export const setItemAsync = async (key: string, value: string) => {
  if (secureStore?.setItemAsync) {
    return secureStore.setItemAsync(key, value);
  }
  return AsyncStorage.setItem(key, value);
};

export const deleteItemAsync = async (key: string) => {
  if (secureStore?.deleteItemAsync) {
    return secureStore.deleteItemAsync(key);
  }
  return AsyncStorage.removeItem(key);
};
