import AsyncStorage from "@react-native-async-storage/async-storage";

// Attempt to load expo-secure-store lazily. If it's unavailable (e.g., when
// running in an environment where the native module isn't installed) fall back
// to AsyncStorage. Dynamic import avoids using `require`, which isn't available
// in Hermes at runtime.
let secureStore: typeof import("expo-secure-store") | null | undefined;

const loadSecureStore = async () => {
  if (secureStore === undefined) {
    try {
      secureStore = await import("expo-secure-store");
    } catch {
      secureStore = null;
    }
  }
  return secureStore;
};

export const getItemAsync = async (key: string) => {
  const store = await loadSecureStore();
  if (store?.getItemAsync) {
    return store.getItemAsync(key);
  }
  return AsyncStorage.getItem(key);
};

export const setItemAsync = async (key: string, value: string) => {
  const store = await loadSecureStore();
  if (store?.setItemAsync) {
    return store.setItemAsync(key, value);
  }
  return AsyncStorage.setItem(key, value);
};

export const deleteItemAsync = async (key: string) => {
  const store = await loadSecureStore();
  if (store?.deleteItemAsync) {
    return store.deleteItemAsync(key);
  }
  return AsyncStorage.removeItem(key);
};
