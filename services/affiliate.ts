import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "affiliate_click_counts";

export type AffiliateType = "flight" | "hotel" | "poi";

export const recordAffiliateClick = async (type: AffiliateType) => {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const data = existing ? JSON.parse(existing) : {};
    data[type] = (data[type] || 0) + 1;
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.error("failed to record affiliate click", e);
  }
};

export const getAffiliateClicks = async (): Promise<Record<string, number>> => {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    return existing ? JSON.parse(existing) : {};
  } catch (e) {
    console.error("failed to load affiliate clicks", e);
    return {};
  }
};
