import i18n from "i18next";
import * as Localization from "expo-localization";
import en from "./en.json";
import et from "./et.json";

// Initialize i18next without the react-i18next adapter. This keeps the
// configuration lightweight and avoids requiring the unused
// "react-i18next" package, which was causing a bundler resolution error.
void i18n.init({
  resources: {
    en: { translation: en },
    et: { translation: et },
  },
  lng: Localization.locale.startsWith("et") ? "et" : "en",
  fallbackLng: "en",
} as any);

export function setLanguage(lng: "en" | "et") {
  void i18n.changeLanguage(lng);
}

export default i18n;
